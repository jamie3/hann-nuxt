import { readFileSync } from 'fs';
import { join } from 'path';
import { Liquid } from 'liquidjs';

// Initialize Liquid engine
const liquid = new Liquid();

/**
 * Load and render an email template using Liquid
 * @param templateName - Name of the template file (without .html)
 * @param data - Data to inject into template
 * @returns Rendered HTML string
 */
export async function renderEmailTemplate(
  templateName: string,
  data: Record<string, any>
): Promise<string> {
  const templatePath = join(process.cwd(), 'server', 'templates', 'emails', `${templateName}.html`);
  const template = readFileSync(templatePath, 'utf-8');
  return await liquid.parseAndRender(template, data);
}
