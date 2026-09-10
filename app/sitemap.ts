import { MetadataRoute } from 'next';
import { getProjects } from '@/lib/data/queries';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const projects = await getProjects(true);

  const projectUrls: MetadataRoute.Sitemap = projects.map((p) => ({
    url: `${siteUrl}/#work`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'monthly',
    priority: p.featured ? 0.8 : 0.6,
  }));

  return [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...projectUrls,
  ];
}
