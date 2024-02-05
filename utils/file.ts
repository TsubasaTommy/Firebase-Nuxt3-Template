/**
 * file->creatCanvas->AVIF->{Blob,width,heigh}
 * @param file 
 * @returns Promise<{blob:Blob, width:number, height:number}>
 */
export const fileToBlob = async(file:File,width:number = 600,ratio:number|null = null,fit:'stretch'|'contain' = 'stretch'):Promise<{blob:Blob, width:number,height:number}>=>{
    console.log("fileToBlob Start")
    const {$resize,$encode} = useNuxtApp()
    
    let img:HTMLImageElement = await setImage(file)
    
    const canvas = document.createElement("canvas")
    const context= canvas.getContext("2d")
    
    context.canvas.width = img.width
    context.canvas.height = img.height
    context.drawImage(img,0,0)
    
    const originalImageData = context.getImageData(0,0,img.width,img.height)
    
    canvas.remove()
    const resizeOption ={
        width:width,
        height: ratio? width/ratio : width/(img.width / img.height),
        premultiply:false,
        linearRGB:false,
        fitMethod:fit
    }
    const resizedImageData = await $resize(originalImageData,resizeOption)
    const option ={
        cqLevel: 30,
        subsample:1,
        speed: 9,
    };
    const avifBuffer = await $encode(resizedImageData,option)
    return {
        blob:new Blob([avifBuffer],{type:"image/avif"}),
        width:resizeOption.width,
        height:resizeOption.height
    }
    
}