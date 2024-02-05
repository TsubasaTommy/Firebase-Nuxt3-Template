# Database Directory
```py
user/
  ├─ "userID"/
  ├─ ...    ├─ (課金用)DateStamp:<Date>
  ├─ ...    ├─ ProjectList:string[]
            └─ Projects/ 
                      ├─"ProjectName"/
                      ├─ ...       ├─ForKonva:{
                                   │   "layerName":{
                                   │        Image:<Blob>string(URL),
                                   │        Outside:boolean,
                                   │        Pin:[{...}],
                                   │        Dot:[{...}] }...}
                                   │
                                   ├─ForPrint:{graph:{}}
                                   │
                                   │
                                   │
                                   ├─ImageList:{
                                      部位list:[],
                                      objects:{"部位名":{
                                            現状仕上げ:string,
                                            所見:string,
                                            備考:string,
                                            判定:string,
                                            足場の必要性:string,
                                            photos:[
                                              {
                                                text:string,
                                                close:<Blob>string(URL),
                                                far:<Blob>string(URL)}...]
```
├ │└ ─

# icon
1 タU 枚  
2 タK 枚  
3 モU ㎡  
4 モK m  
5 トU ㎡  
6 上K m  
7 エフ ヶ所  
8 腐 ヶ所  