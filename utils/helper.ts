
/**
 * 
 * @param blob 
 * @returns new Image.src(blob)
 */
export const setImage = (blob:Blob|File|string):Promise<HTMLImageElement>=>{
    return new Promise((resolve,reject)=>{
        const img = new Image()
        img.onload = ()=>resolve(img)
        img.onerror = (e) =>reject(e)
        img.src = typeof blob != "string" ? URL.createObjectURL(blob):blob
    })
}