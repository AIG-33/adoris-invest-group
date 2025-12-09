import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch
import matplotlib.lines as mlines

# Set up the figure
fig, ax = plt.subplots(1, 1, figsize=(14, 10))
ax.set_xlim(0, 10)
ax.set_ylim(0, 10)
ax.axis('off')

# Colors
github_color = '#24292e'
vercel_color = '#000000'
supabase_color = '#3ECF8E'
domain_color = '#0066cc'
green_accent = '#20a895'
light_green = '#2ec4b6'

# Title
ax.text(5, 9.5, 'ADORIS INVEST GROUP', fontsize=24, weight='bold', 
        ha='center', color=green_accent)
ax.text(5, 9.0, 'Vercel Deployment Architecture', fontsize=16, 
        ha='center', color='#666')

# Step 1: GitHub Repository
github_box = FancyBboxPatch((0.5, 7.0), 2, 1, boxstyle="round,pad=0.1", 
                           edgecolor=github_color, facecolor='#f6f8fa', linewidth=2)
ax.add_patch(github_box)
ax.text(1.5, 7.7, '1. GitHub', fontsize=12, weight='bold', ha='center')
ax.text(1.5, 7.35, 'AIG-33/adoris-invest-group', fontsize=9, ha='center', style='italic')

# Step 2: Vercel
vercel_box = FancyBboxPatch((3.5, 7.0), 2, 1, boxstyle="round,pad=0.1", 
                           edgecolor=vercel_color, facecolor='#f0f0f0', linewidth=2)
ax.add_patch(vercel_box)
ax.text(4.5, 7.7, '2. Vercel', fontsize=12, weight='bold', ha='center')
ax.text(4.5, 7.35, 'Auto Deploy', fontsize=9, ha='center', color='green')

# Step 3: Domain Setup
domain_box = FancyBboxPatch((6.5, 7.0), 2.5, 1, boxstyle="round,pad=0.1", 
                           edgecolor=domain_color, facecolor='#e3f2fd', linewidth=2)
ax.add_patch(domain_box)
ax.text(7.75, 7.7, '3. Custom Domain', fontsize=12, weight='bold', ha='center')
ax.text(7.75, 7.35, 'shop.adorisgroup.com', fontsize=9, ha='center', color=domain_color)

# Arrow 1: GitHub -> Vercel
arrow1 = FancyArrowPatch((2.5, 7.5), (3.5, 7.5),
                        arrowstyle='->', mutation_scale=20, linewidth=2,
                        color=github_color)
ax.add_patch(arrow1)
ax.text(3, 7.7, 'push', fontsize=8, ha='center', style='italic')

# Arrow 2: Vercel -> Domain
arrow2 = FancyArrowPatch((5.5, 7.5), (6.5, 7.5),
                        arrowstyle='->', mutation_scale=20, linewidth=2,
                        color=vercel_color)
ax.add_patch(arrow2)
ax.text(6, 7.7, 'deploy', fontsize=8, ha='center', style='italic')

# Database Connection (Supabase)
supabase_box = FancyBboxPatch((0.5, 5.0), 2.5, 1.2, boxstyle="round,pad=0.1", 
                             edgecolor=supabase_color, facecolor='#e8f5e9', linewidth=2)
ax.add_patch(supabase_box)
ax.text(1.75, 5.85, 'Supabase PostgreSQL', fontsize=11, weight='bold', ha='center')
ax.text(1.75, 5.55, 'Transaction Pooler', fontsize=9, ha='center', color=supabase_color)
ax.text(1.75, 5.25, 'Port 6543', fontsize=8, ha='center', style='italic')

# Email Service (Gmail SMTP)
email_box = FancyBboxPatch((3.5, 5.0), 2.5, 1.2, boxstyle="round,pad=0.1", 
                          edgecolor='#D44638', facecolor='#ffebee', linewidth=2)
ax.add_patch(email_box)
ax.text(4.75, 5.85, 'Gmail SMTP', fontsize=11, weight='bold', ha='center')
ax.text(4.75, 5.55, 'info@adorisgroup.com', fontsize=9, ha='center', color='#D44638')
ax.text(4.75, 5.25, 'Port 587', fontsize=8, ha='center', style='italic')

# Storage (AWS S3)
storage_box = FancyBboxPatch((6.5, 5.0), 2.5, 1.2, boxstyle="round,pad=0.1", 
                            edgecolor='#FF9900', facecolor='#fff3e0', linewidth=2)
ax.add_patch(storage_box)
ax.text(7.75, 5.85, 'AWS S3 Storage', fontsize=11, weight='bold', ha='center')
ax.text(7.75, 5.55, 'File Uploads', fontsize=9, ha='center', color='#FF9900')
ax.text(7.75, 5.25, 'us-west-2', fontsize=8, ha='center', style='italic')

# Connections from Vercel to services
# To Database
arrow_db = FancyArrowPatch((4.5, 7.0), (1.75, 6.2),
                          arrowstyle='<->', mutation_scale=15, linewidth=1.5,
                          color=supabase_color, linestyle='--')
ax.add_patch(arrow_db)

# To Email
arrow_email = FancyArrowPatch((4.5, 7.0), (4.75, 6.2),
                             arrowstyle='->', mutation_scale=15, linewidth=1.5,
                             color='#D44638', linestyle='--')
ax.add_patch(arrow_email)

# To Storage
arrow_storage = FancyArrowPatch((4.5, 7.0), (7.75, 6.2),
                               arrowstyle='<->', mutation_scale=15, linewidth=1.5,
                               color='#FF9900', linestyle='--')
ax.add_patch(arrow_storage)

# Environment Variables section
env_box = FancyBboxPatch((0.5, 2.5), 8.5, 2, boxstyle="round,pad=0.1", 
                        edgecolor=green_accent, facecolor='#f0f9f8', linewidth=2)
ax.add_patch(env_box)
ax.text(4.75, 4.2, 'Environment Variables (Vercel Settings)', fontsize=12, 
        weight='bold', ha='center', color=green_accent)

# Environment variables list
env_vars = [
    'DATABASE_URL (Supabase Connection)',
    'NEXTAUTH_SECRET & NEXTAUTH_URL',
    'AWS_* (S3 Configuration)',
    'SMTP_* & EMAIL_* (Gmail SMTP)'
]

y_pos = 3.7
for var in env_vars:
    ax.text(0.8, y_pos, f'• {var}', fontsize=9, ha='left')
    y_pos -= 0.3

# Deployment Steps
steps_box = FancyBboxPatch((0.5, 0.2), 8.5, 2, boxstyle="round,pad=0.1", 
                          edgecolor='#666', facecolor='#fafafa', linewidth=2)
ax.add_patch(steps_box)
ax.text(4.75, 1.95, 'Quick Deployment Steps', fontsize=12, 
        weight='bold', ha='center', color='#333')

steps = [
    '1. Import GitHub repo to Vercel',
    '2. Set Root Directory: nextjs_space/',
    '3. Configure Environment Variables',
    '4. Deploy and get vercel.app URL',
    '5. Add Custom Domain: shop.adorisgroup.com',
    '6. Configure DNS CNAME record'
]

y_pos = 1.6
col1_x = 1.0
col2_x = 5.5

for i, step in enumerate(steps):
    x_pos = col1_x if i < 3 else col2_x
    y = y_pos if i < 3 else y_pos + (3 - i) * 0.3
    ax.text(x_pos, y_pos - (i % 3) * 0.3, step, fontsize=8.5, ha='left')

# Footer
ax.text(5, 0.05, '🚀 Ready for Production Deployment', fontsize=10, 
        ha='center', weight='bold', color=green_accent)

plt.tight_layout()
plt.savefig('/home/ubuntu/ivdgroup_mvp/vercel_architecture_diagram.png', dpi=300, bbox_inches='tight')
print("Deployment architecture diagram created successfully!")
