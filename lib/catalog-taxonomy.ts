import { unstable_cache } from 'next/cache'
import { prisma } from './db'
import { retryPrismaQuery } from './retry-prisma'
import { resolveLegacyCategory } from './legacy-redirects'

/**
 * Two-level catalog taxonomy: top-level sections (parentId = null) and
 * subcategories. Products link to a subcategory; a section page lists the
 * products of all its subcategories.
 */

/** Research-area facet for antibodies (`/products?category=antibodies&area=<slug>`). */
export const RESEARCH_AREAS: Record<string, string> = {
  cancer: 'Cancer',
  immunology: 'Immunology & Inflammation',
  neuroscience: 'Neuroscience',
  cardiovascular: 'Cardiovascular',
  metabolism: 'Metabolism & Endocrinology',
  'signal-transduction': 'Signal Transduction',
  'cell-cycle-apoptosis': 'Cell Cycle & Apoptosis',
  epigenetics: 'Epigenetics & Gene Expression',
  'stem-cells-development': 'Stem Cells & Development',
  'infectious-disease': 'Infectious Disease',
  'cell-biology': 'Cell Biology',
}

/** Section whose products carry `researchArea`. */
export const RESEARCH_AREA_SECTION = 'antibodies'

/** Fallback category for products whose type is unknown (imports, new SKUs). */
export const FALLBACK_CATEGORY_SLUG = 'other'

export type CategoryNode = {
  id: string
  name: string
  slug: string
  description: string | null
  parentId: string | null
  sortOrder: number
  /** Own products + products of all subcategories */
  productCount: number
  children: CategoryNode[]
}

export type CategoryTree = {
  sections: CategoryNode[]
  bySlug: Record<string, CategoryNode>
  byId: Record<string, CategoryNode>
}

async function loadCategoryTree(): Promise<CategoryTree> {
  const rows = await retryPrismaQuery(
    () => prisma.$queryRaw<Array<{
      id: string; name: string; slug: string; description: string | null
      parentId: string | null; sortOrder: number; productCount: bigint
    }>>`
      SELECT c.id, c.name, c.slug, c.description, c."parentId", c."sortOrder",
             COUNT(p.id) AS "productCount"
      FROM "Category" c
      LEFT JOIN "Product" p ON p."categoryId" = c.id
      GROUP BY c.id
    `
  )
  const byId: Record<string, CategoryNode> = {}
  for (const r of rows) {
    byId[r.id] = {
      id: r.id, name: r.name, slug: r.slug, description: r.description,
      parentId: r.parentId, sortOrder: r.sortOrder, productCount: Number(r.productCount), children: [],
    }
  }
  const sections: CategoryNode[] = []
  for (const node of Object.values(byId)) {
    const parent = node.parentId ? byId[node.parentId] : undefined
    if (parent) parent.children.push(node)
    else sections.push(node)
  }
  const order = (a: CategoryNode, b: CategoryNode) =>
    a.sortOrder - b.sortOrder || b.productCount - a.productCount || a.name.localeCompare(b.name)
  for (const s of sections) {
    s.children.sort(order)
    s.productCount += s.children.reduce((sum, c) => sum + c.productCount, 0)
  }
  sections.sort(order)
  const bySlug: Record<string, CategoryNode> = {}
  for (const node of Object.values(byId)) bySlug[node.slug] = node
  return { sections, bySlug, byId }
}

export const getCachedCategoryTree = unstable_cache(loadCategoryTree, ['category-tree'], {
  revalidate: 1800,
  tags: ['categories', 'products-count'],
})

/**
 * Sections and subcategories that currently have products. Legacy slugs are left out:
 * middleware 301s them, so linking to them would only add redirect hops.
 */
export function visibleSections(tree: CategoryTree): CategoryNode[] {
  const visible = (c: CategoryNode) => c.productCount > 0 && !resolveLegacyCategory(c.slug)
  return tree.sections
    .filter(visible)
    .map((s) => ({ ...s, children: s.children.filter(visible) }))
}

/** Category ids matched by `?category=<slug>`: the category itself plus its subcategories. */
export function categoryIdsForSlug(tree: CategoryTree, slug: string): string[] | null {
  const node = tree.bySlug[slug]
  if (!node) return null
  return [node.id, ...node.children.map((c) => c.id)]
}

export function parentOf(tree: CategoryTree, node: CategoryNode | undefined): CategoryNode | undefined {
  return node?.parentId ? tree.byId[node.parentId] : undefined
}
