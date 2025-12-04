declare module 'downdoc' {
  /**
   * Converts AsciiDoc content to Markdown
   * @param asciidoc - The AsciiDoc content to convert
   * @returns The converted Markdown content
   */
  export default function downdoc(asciidoc: string): string
}
