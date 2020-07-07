declare module '@editorjs/image' {
  import { BlockToolConstructable } from '@editorjs/editorjs'
  interface ImageConstructor extends BlockToolConstructable {}

  const k: ImageConstructor
  export = k
}
