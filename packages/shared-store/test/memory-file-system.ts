import type { SharedStoreFileSystem } from "../src/file-system";

type BeforeReadHandler = (
  fileUri: string,
  readCount: number,
  fileSystem: MemoryFileSystem,
) => void;

export class MemoryFileSystem implements SharedStoreFileSystem {
  readonly directoryUri = "content://memory/tree/UPIICSA_Calpulli_Shared";
  onBeforeRead?: BeforeReadHandler;
  corruptNextWriteToFileName?: string;

  private readonly files = new Map<string, string>();
  private readonly directories = new Set<string>([this.directoryUri]);
  private readonly readCounts = new Map<string, number>();

  async listDirectory(directoryUri: string): Promise<string[]> {
    this.assertDirectory(directoryUri);
    const prefix = `${directoryUri}/`;
    return [
      ...[...this.directories].filter(
        (uri) => uri.startsWith(prefix) && !uri.slice(prefix.length).includes("/"),
      ),
      ...[...this.files.keys()].filter(
        (uri) => uri.startsWith(prefix) && !uri.slice(prefix.length).includes("/"),
      ),
    ];
  }

  async createDirectory(
    directoryUri: string,
    directoryName: string,
  ): Promise<string> {
    this.assertDirectory(directoryUri);
    const uri = `${directoryUri}/${encodeURIComponent(directoryName)}`;
    if (this.directories.has(uri)) throw new Error(`El directorio ${directoryName} ya existe.`);
    this.directories.add(uri);
    return uri;
  }

  async createFile(
    directoryUri: string,
    fileName: string,
    _mimeType: string,
  ): Promise<string> {
    this.assertDirectory(directoryUri);
    const fileUri = `${directoryUri}/${encodeURIComponent(fileName)}`;

    if (this.files.has(fileUri)) {
      throw new Error(`El archivo ${fileName} ya existe.`);
    }

    this.files.set(fileUri, "");
    return fileUri;
  }

  async readText(fileUri: string): Promise<string> {
    const readCount = (this.readCounts.get(fileUri) ?? 0) + 1;
    this.readCounts.set(fileUri, readCount);
    this.onBeforeRead?.(fileUri, readCount, this);

    const contents = this.files.get(fileUri);

    if (contents === undefined) {
      throw new Error(`No existe ${fileUri}.`);
    }

    return contents;
  }

  readBase64(fileUri: string): Promise<string> {
    return this.readText(fileUri);
  }

  async writeText(fileUri: string, contents: string): Promise<void> {
    if (!this.files.has(fileUri)) {
      throw new Error(`No existe ${fileUri}.`);
    }

    if (this.corruptNextWriteToFileName === this.fileName(fileUri)) {
      this.corruptNextWriteToFileName = undefined;
      this.files.set(fileUri, "{}");
      return;
    }

    this.files.set(fileUri, contents);
  }

  writeBase64(fileUri: string, contents: string): Promise<void> {
    return this.writeText(fileUri, contents);
  }

  async deleteFile(fileUri: string): Promise<void> {
    this.files.delete(fileUri);
  }

  fileName(fileUri: string): string {
    const decoded = decodeURIComponent(fileUri);
    return decoded.slice(decoded.lastIndexOf("/") + 1);
  }

  fileUri(fileName: string): string {
    const entry = [...this.files.keys()].find(
      (fileUri) => this.fileName(fileUri) === fileName,
    );

    if (entry === undefined) {
      throw new Error(`No existe ${fileName}.`);
    }

    return entry;
  }

  setFile(fileName: string, contents: string): void {
    this.files.set(
      `${this.directoryUri}/${encodeURIComponent(fileName)}`,
      contents,
    );
  }

  readRaw(fileName: string): string {
    return this.files.get(this.fileUri(fileName)) ?? "";
  }

  listFileNames(): string[] {
    return [...this.files.keys()].map((fileUri) => this.fileName(fileUri));
  }

  private assertDirectory(directoryUri: string): void {
    if (!this.directories.has(directoryUri)) {
      throw new Error("Directorio desconocido.");
    }
  }
}
