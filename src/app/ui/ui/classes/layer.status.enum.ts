export enum LayerStatusEnum {

    DOWNLOADING = 'DOWNLOADING',
    EXTRACTING = 'EXTRACTING',
    COMPLETED = 'COMPLETED'

}

export function getLayerStatusMessage(status: LayerStatusEnum) {
    if (status == LayerStatusEnum.DOWNLOADING) {
        return "Baixando...";
    } else if (status == LayerStatusEnum.EXTRACTING) {
        return "Extraindo...";
    } else if (status == LayerStatusEnum.COMPLETED) {
        return "Concluído!";
    }

    return "Desconhecido";
}