
export enum TILE_PROVIDER {
	"TONER_STANDARD" = "Toner standard",
	"TONER_BACKGROUND" = "Toner only background",
	"TERRAIN_STANDARD" = "Terrain standard",
	"TERRAIN_BACKGROUND" = "Terrain only background",
	"WATERCOLOR_BACKGROUND" = "Watercolor",
}

export class MapProvider {

	public static getAttribution(type: TILE_PROVIDER): JSX.Element | undefined {
		if (type === TILE_PROVIDER.TONER_STANDARD || type === TILE_PROVIDER.TONER_BACKGROUND || type === TILE_PROVIDER.TERRAIN_STANDARD || type === TILE_PROVIDER.TERRAIN_BACKGROUND) {
			return <>Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.</>;
		}
		if (type === TILE_PROVIDER.WATERCOLOR_BACKGROUND) {
			return <>Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://creativecommons.org/licenses/by-sa/3.0">CC BY SA</a>.</>;
		}
	}


	public static getTileProvider(type: TILE_PROVIDER | string) {
		if (typeof type === "string") {
			// Convert string to TILE_PROVIDER
			const typedString = type as keyof typeof TILE_PROVIDER;
			type = TILE_PROVIDER[typedString];
		}

		if (type === TILE_PROVIDER.TONER_STANDARD) {
			return MapProvider.tileProviderStamenTonerStandard;
		}
		if (type === TILE_PROVIDER.TONER_BACKGROUND) {
			return MapProvider.tileProviderStamenTonerBackground;
		}
		if (type === TILE_PROVIDER.TERRAIN_STANDARD) {
			return MapProvider.tileProviderStamenTerrainStandard;
		}
		if (type === TILE_PROVIDER.TERRAIN_BACKGROUND) {
			return MapProvider.tileProviderStamenTerrainBackground;
		}
		if (type === TILE_PROVIDER.WATERCOLOR_BACKGROUND) {
			return MapProvider.tileProviderStamenWatercolor;
		}
		console.log("NOT FOUND", type, typeof type);
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private static tileProviderStamenTonerStandard(x: number, y: number, z: number, _dpr?: number): string {
		return `https://stamen-tiles.a.ssl.fastly.net/toner/${z}/${x}/${y}.png`;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private static tileProviderStamenTonerBackground(x: number, y: number, z: number, _dpr?: number): string {
		return `https://stamen-tiles.a.ssl.fastly.net/toner-background/${z}/${x}/${y}.png`;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private static tileProviderStamenTerrainStandard(x: number, y: number, z: number, _dpr?: number): string {
		return `https://stamen-tiles.a.ssl.fastly.net/terrain/${z}/${x}/${y}.jpg`;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private static tileProviderStamenTerrainBackground(x: number, y: number, z: number, _dpr?: number): string {
		return `https://stamen-tiles.a.ssl.fastly.net/terrain-background/${z}/${x}/${y}.jpg`;
	}
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	private static tileProviderStamenWatercolor(x: number, y: number, z: number, _dpr?: number): string {
		return `https://stamen-tiles.a.ssl.fastly.net/watercolor/${z}/${x}/${y}.jpg`;
	}
}