export interface Asset {
    localPath: string;
    hostingUri?: string;
}
export declare const assetsTablePath: string;
export declare const assetsTableVcsPath: string;
/**
 * Load assets from tuture-assets.json.
 * If not present, return an empty array.
 */
export declare function loadAssetsTable(): Asset[];
//# sourceMappingURL=assets.d.ts.map