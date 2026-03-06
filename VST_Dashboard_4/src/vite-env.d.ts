/// <reference types="vite/client" />
/// <reference path="./speech-recognition.d.ts" />


declare module "figma:asset/*.png" {
    const content: string;
    export default content;
}

declare module "figma:asset/*" {
    const content: string;
    export default content;
}
