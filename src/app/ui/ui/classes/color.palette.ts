export class ColorPalette {

    private static defaultColor: string = "orange";

    private static  colors: string[] = [

        "#60A69F", "#CFBA63", "#87677B", "#D5A271", "#456C68", "#BC897A", "#A37182", "#7A7CA8", "#6C93C5", "#78B6D9",
        "#6B9360", "#6CAEBC", "#6682BB", "#8F7795", "#AF9C5E", "#90BA58", "#5D6986", "#7565A4", "#6B86A2", "#72A5CF",
        "#BFCBC2", "#DC9E82", "#C16E70", "#030027", "#A0CFD3", "#8D94BA", "#EEBA69", "#EE92C2", "#A8B4A5", "#725D68",
        "#2F242C", "#502274", "#EEB4B3", "#786F52", "#090446", "#C2095A", "#4F000B", "#720026", "#3D1308", "#C8D6AF",

        "#72A5CF", "#6B9360", "#90BA58", "#456C68", "#5D6986", "#6CAEBC", "#6682BB", "#7A7CA8", "#8F7795", "#A37182",
        "#6C93C5", "#AFBA5E", "#CFBA63", "#EEBA69", "#D5A271", "#BC897A", "#78B6D9", "#60A69F", "#7565A4", "#6B86A2",
        "#72A5CF", "#6B9360", "#90BA58", "#456C68", "#5D6986", "#6CAEBC", "#6682BB", "#7A7CA8", "#8F7795", "#A37182",
        "#6C93C5", "#AFBA5E", "#CFBA63", "#EEBA69", "#D5A271", "#BC897A", "#78B6D9", "#60A69F", "#7565A4", "#6B86A2"

    ];
    // private static  colors: string[] = [
    //     "#FF4500", "#FFA500", "#B0E0E6", "#000080", "#FF0055", "#6B8E23", "#FFC0CB", "#DDA0DD", "#A0522D", "#F4A460",
    //     "#9ACD32",
    //     "#A52A2A", "#DEB887", "#6495ED", "#FF7F50", "#FAEBD7", "#B8860B", "#DC143C", "#006400", "#BDB76B", "#8B008B",
    //     "#FF8C00", "#8B0000", "#E9967A", "#8FBC8F", "#FF1493", "#FFFAF0", "#228B22", "#FF00FF", "#FFD700", "#FF69B4",
    //     "#4B0082", "#F0E68C", "#CD5C5C", "#FFF0F5", "#F08080", "#87CEFA", "#B0C4DE", "#FF00FF", "#800000", "#BA55D3",
    //     "#f2d24b","#f67c00","#b22019","#22356b","#8ca57c","#313233","#2a5b6a","#8b2a57","#ecceca","#d1a858", "#762d94",
    //     "#7bbbec", "#eecc65", "#ffb900","#b71f1f","#cc0000","#330033","#993366","#009955","#cc3300"
    // ];

    public static getColor(index: number) : string {
        if (index >= this.colors.length){
            return this.defaultColor;
        }
        return this.colors[index];
    }
}
