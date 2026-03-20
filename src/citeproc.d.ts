declare module 'citeproc' {
  interface SysAdapter {
    retrieveLocale(lang: string): string
    retrieveItem(id: string): unknown
  }

  class Engine {
    constructor(sys: SysAdapter, style: string, lang?: string, forceLang?: boolean)
    updateItems(ids: string[]): void
    makeBibliography(): [{ bibstart: string; bibend: string }, string[]]
    makeCitationCluster(citations: Array<{ id: string }>): string
  }

  export default { Engine }
  export { Engine }
}
