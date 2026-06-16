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

/**
 * Render a raw Liquid template string (e.g. a database-stored email template).
 * Supports nested variables such as {{ referral.first_name }}.
 * @param templateString - The raw template source
 * @param data - Data to inject into the template
 * @returns Rendered string
 */
export async function renderTemplateString(
  templateString: string,
  data: Record<string, any>
): Promise<string> {
  return await liquid.parseAndRender(templateString, data);
}
