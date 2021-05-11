export interface Printable {
    target;

    nomeArquivoSalvo;

    imprimir();

    salvarPng();

    salvarPdf();

    salvarJpeg();

    salvarSvg();

    salvarXls();
}
