// Setup Directus Collections via API
// Run this with: node setup-directus-collections.js

const { createDirectus, rest, createCollection, createField, authentication, staticToken } = require('@directus/sdk');

const directus = createDirectus('http://localhost:8055').with(rest());

async function setupCollections() {
  try {
    // Login as admin with proper format
    const auth = await directus.login({
      email: 'alper.tombulca@web.de',
      password: 'CarBot2024!'
    });
    console.log('✅ Logged in successfully');

    // 1. Create Services Collection
    console.log('Creating Services collection...');
    await directus.request(createCollection({
      collection: 'services',
      meta: {
        collection: 'services',
        icon: 'build',
        note: 'Workshop services like TÜV, Inspektion, Reparaturen',
        display_template: '{{name}} - {{price_from}}€',
        hidden: false,
        singleton: false,
        translations: [
          {
            language: 'de-DE',
            translation: 'Dienstleistungen',
            singular: 'Dienstleistung',
            plural: 'Dienstleistungen'
          }
        ],
        sort_field: 'sort'
      },
      schema: {
        name: 'services'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: { hidden: true, readonly: true, interface: 'input' },
          schema: { is_primary_key: true, has_auto_increment: true }
        },
        {
          field: 'status',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: 'Entwurf', value: 'draft' },
                { text: 'Veröffentlicht', value: 'published' },
                { text: 'Archiviert', value: 'archived' }
              ]
            }
          },
          schema: { default_value: 'draft' }
        },
        {
          field: 'sort',
          type: 'integer',
          meta: { interface: 'input', hidden: true }
        },
        {
          field: 'name',
          type: 'string',
          meta: { interface: 'input', required: true, width: 'full' },
          schema: { is_nullable: false }
        },
        {
          field: 'slug',
          type: 'string',
          meta: { interface: 'input', width: 'full' }
        },
        {
          field: 'description',
          type: 'text',
          meta: { interface: 'input-rich-text-html', width: 'full' }
        },
        {
          field: 'category',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            width: 'half',
            options: {
              choices: [
                { text: 'TÜV & HU', value: 'tuv-hu' },
                { text: 'Inspektion', value: 'inspektion' },
                { text: 'Reparaturen', value: 'reparaturen' },
                { text: 'Wartung', value: 'wartung' },
                { text: 'Reifenservice', value: 'reifen' },
                { text: 'Elektrik', value: 'elektrik' },
                { text: 'Klimaservice', value: 'klima' },
                { text: 'Karosserie', value: 'karosserie' }
              ]
            }
          }
        },
        {
          field: 'price_from',
          type: 'decimal',
          meta: { interface: 'input', width: 'half' },
          schema: { numeric_precision: 10, numeric_scale: 2 }
        },
        {
          field: 'price_to',
          type: 'decimal',
          meta: { interface: 'input', width: 'half' },
          schema: { numeric_precision: 10, numeric_scale: 2 }
        },
        {
          field: 'duration_minutes',
          type: 'integer',
          meta: { interface: 'input', width: 'half' }
        },
        {
          field: 'image',
          type: 'uuid',
          meta: { interface: 'file-image', width: 'full' }
        }
      ]
    }));
    console.log('✅ Services collection created');

    // 2. Create Blog Posts Collection
    console.log('Creating Blog Posts collection...');
    await directus.request(createCollection({
      collection: 'blog_posts',
      meta: {
        collection: 'blog_posts',
        icon: 'article',
        note: 'Technical articles and news for workshops',
        display_template: '{{title}}',
        translations: [
          {
            language: 'de-DE',
            translation: 'Blog Artikel',
            singular: 'Artikel',
            plural: 'Artikel'
          }
        ]
      },
      schema: {
        name: 'blog_posts'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: { hidden: true, readonly: true, interface: 'input' },
          schema: { is_primary_key: true, has_auto_increment: true }
        },
        {
          field: 'status',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: 'Entwurf', value: 'draft' },
                { text: 'Veröffentlicht', value: 'published' },
                { text: 'Archiviert', value: 'archived' }
              ]
            }
          },
          schema: { default_value: 'draft' }
        },
        {
          field: 'title',
          type: 'string',
          meta: { interface: 'input', required: true, width: 'full' },
          schema: { is_nullable: false }
        },
        {
          field: 'slug',
          type: 'string',
          meta: { interface: 'input', width: 'full' }
        },
        {
          field: 'excerpt',
          type: 'text',
          meta: { interface: 'input-multiline', width: 'full' }
        },
        {
          field: 'content',
          type: 'text',
          meta: { interface: 'input-rich-text-html', width: 'full' }
        },
        {
          field: 'featured_image',
          type: 'uuid',
          meta: { interface: 'file-image', width: 'full' }
        },
        {
          field: 'author',
          type: 'string',
          meta: { interface: 'input', width: 'half' }
        },
        {
          field: 'published_date',
          type: 'datetime',
          meta: { interface: 'datetime', width: 'half' }
        }
      ]
    }));
    console.log('✅ Blog Posts collection created');

    // 3. Create FAQs Collection
    console.log('Creating FAQs collection...');
    await directus.request(createCollection({
      collection: 'faqs',
      meta: {
        collection: 'faqs',
        icon: 'help',
        note: 'Frequently asked questions in multiple languages',
        display_template: '{{question}}',
        translations: [
          {
            language: 'de-DE',
            translation: 'FAQ',
            singular: 'Frage',
            plural: 'Fragen'
          }
        ]
      },
      schema: {
        name: 'faqs'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: { hidden: true, readonly: true, interface: 'input' },
          schema: { is_primary_key: true, has_auto_increment: true }
        },
        {
          field: 'status',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: 'Entwurf', value: 'draft' },
                { text: 'Veröffentlicht', value: 'published' },
                { text: 'Archiviert', value: 'archived' }
              ]
            }
          },
          schema: { default_value: 'published' }
        },
        {
          field: 'sort',
          type: 'integer',
          meta: { interface: 'input', hidden: true }
        },
        {
          field: 'question',
          type: 'text',
          meta: { interface: 'input-multiline', required: true, width: 'full' },
          schema: { is_nullable: false }
        },
        {
          field: 'answer',
          type: 'text',
          meta: { interface: 'input-rich-text-html', required: true, width: 'full' },
          schema: { is_nullable: false }
        },
        {
          field: 'category',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            width: 'half',
            options: {
              choices: [
                { text: 'Allgemein', value: 'general' },
                { text: 'TÜV & HU', value: 'tuv' },
                { text: 'Reparaturen', value: 'repairs' },
                { text: 'Wartung', value: 'maintenance' },
                { text: 'Preise', value: 'pricing' }
              ]
            }
          }
        },
        {
          field: 'language',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            width: 'half',
            options: {
              choices: [
                { text: 'Deutsch', value: 'de' },
                { text: 'English', value: 'en' },
                { text: 'Türkçe', value: 'tr' },
                { text: 'Polski', value: 'pl' }
              ]
            }
          },
          schema: { default_value: 'de' }
        }
      ]
    }));
    console.log('✅ FAQs collection created');

    // 4. Create Testimonials Collection
    console.log('Creating Testimonials collection...');
    await directus.request(createCollection({
      collection: 'testimonials',
      meta: {
        collection: 'testimonials',
        icon: 'star',
        note: 'Customer testimonials and reviews',
        display_template: '{{customer_name}} - {{rating}}/5',
        translations: [
          {
            language: 'de-DE',
            translation: 'Bewertungen',
            singular: 'Bewertung',
            plural: 'Bewertungen'
          }
        ]
      },
      schema: {
        name: 'testimonials'
      },
      fields: [
        {
          field: 'id',
          type: 'integer',
          meta: { hidden: true, readonly: true, interface: 'input' },
          schema: { is_primary_key: true, has_auto_increment: true }
        },
        {
          field: 'status',
          type: 'string',
          meta: {
            interface: 'select-dropdown',
            options: {
              choices: [
                { text: 'Entwurf', value: 'draft' },
                { text: 'Veröffentlicht', value: 'published' },
                { text: 'Archiviert', value: 'archived' }
              ]
            }
          },
          schema: { default_value: 'published' }
        },
        {
          field: 'customer_name',
          type: 'string',
          meta: { interface: 'input', required: true, width: 'half' },
          schema: { is_nullable: false }
        },
        {
          field: 'customer_company',
          type: 'string',
          meta: { interface: 'input', width: 'half' }
        },
        {
          field: 'rating',
          type: 'integer',
          meta: {
            interface: 'select-dropdown',
            width: 'half',
            options: {
              choices: [
                { text: '⭐ 1 Stern', value: 1 },
                { text: '⭐⭐ 2 Sterne', value: 2 },
                { text: '⭐⭐⭐ 3 Sterne', value: 3 },
                { text: '⭐⭐⭐⭐ 4 Sterne', value: 4 },
                { text: '⭐⭐⭐⭐⭐ 5 Sterne', value: 5 }
              ]
            }
          }
        },
        {
          field: 'testimonial_text',
          type: 'text',
          meta: { interface: 'input-multiline', required: true, width: 'full' },
          schema: { is_nullable: false }
        },
        {
          field: 'customer_photo',
          type: 'uuid',
          meta: { interface: 'file-image', width: 'full' }
        }
      ]
    }));
    console.log('✅ Testimonials collection created');

    console.log('\n🎉 All collections created successfully!');
    console.log('\nYou can now:');
    console.log('1. Add services (TÜV, Inspektion, etc.)');
    console.log('2. Write blog articles');
    console.log('3. Create FAQs');
    console.log('4. Add customer testimonials');

  } catch (error) {
    console.error('❌ Error setting up collections:', error);
  }
}

setupCollections();