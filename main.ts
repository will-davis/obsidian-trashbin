import { Plugin, Notice, setIcon, TAbstractFile } from 'obsidian';

export default class TrashBinPlugin extends Plugin {
    trashIconEl: HTMLElement | null = null;
    dragOverClass = 'trash-drag-over';

    async onload() {
        this.app.workspace.onLayoutReady(() => {
            this.tryInject();
        });

        this.registerEvent(this.app.workspace.on('layout-change', () => {
            this.tryInject();
        }));
    }

    onunload() {
        this.removeTrashIcon();
    }

    removeTrashIcon() {
        if (this.trashIconEl) {
            this.trashIconEl.detach();
            this.trashIconEl = null;
        }
    }

    tryInject() {
        if (document.querySelector('.trash-bin-icon')) {
            return;
        }

        const settingsIcon = document.querySelector('.side-dock-settings-icon') ||
            document.querySelector('.side-dock-ribbon-action[aria-label="Settings"]');

        const ribbonBottom = document.querySelector('.side-dock-settings') ||
            document.querySelector('.side-dock-ribbon-bottom');

        const target = (settingsIcon?.parentElement || ribbonBottom) as HTMLElement;

        if (target) {
            this.addTrashIcon(target);
        } else {
            setTimeout(() => {
                const retryTarget = (document.querySelector('.side-dock-settings-icon')?.parentElement ||
                    document.querySelector('.side-dock-settings')) as HTMLElement;
                if (retryTarget && !document.querySelector('.trash-bin-icon')) {
                    this.addTrashIcon(retryTarget);
                }
            }, 2000);
        }
    }

    addTrashIcon(container: HTMLElement) {
        this.trashIconEl = container.createDiv({
            cls: 'side-dock-ribbon-action trash-bin-icon',
            attr: {
                'aria-label': 'Drag files here to trash',
                'data-tooltip-position': 'right'
            }
        });

        setIcon(this.trashIconEl, 'trash');

        this.registerDomEvent(this.trashIconEl, 'dragenter', (e) => {
            e.preventDefault();
            this.trashIconEl?.addClass(this.dragOverClass);
        });

        this.registerDomEvent(this.trashIconEl, 'dragover', (e) => {
            e.preventDefault();
            this.trashIconEl?.addClass(this.dragOverClass);
        });

        this.registerDomEvent(this.trashIconEl, 'dragleave', (e) => {
            e.preventDefault();
            this.trashIconEl?.removeClass(this.dragOverClass);
        });

        this.registerDomEvent(this.trashIconEl, 'drop', async (e) => {
            e.preventDefault();
            this.trashIconEl?.removeClass(this.dragOverClass);
            await this.handleDrop(e);
        });

        this.registerDomEvent(this.trashIconEl, 'click', () => {
            new Notice('Drag files here to move them to trash.');
        });
    }

    async handleDrop(e: DragEvent) {
        // @ts-ignore
        const dragManager = this.app.dragManager;

        if (dragManager && dragManager.draggable) {
            const dragData = dragManager.draggable;
            let item: TAbstractFile | null = null;

            if (dragData.type === 'file') {
                item = dragData.file;
            } else if (dragData.type === 'folder') {
                item = dragData.file || dragData.folder;
            }

            if (item) {
                await this.deleteFile(item);
            }
        }
    }

    async deleteFile(item: TAbstractFile) {
        if (!item || !item.name) return;

        try {
            // @ts-ignore
            const useSystemTrash = this.app.vault.config?.trashOption === 'system';
            await this.app.vault.trash(item, useSystemTrash);
            new Notice(`Moved "${item.name}" to ${useSystemTrash ? 'system ' : ''}trash.`);
        } catch (error) {
            console.error(`TrashBinPlugin: Failed to delete ${item.name}`, error);
            new Notice(`Failed to delete "${item.name}".`);
        }
    }
}
