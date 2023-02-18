export namespace main {
	
	export class NostalgiaCustomSettings {
	    ALTTOGGLE: boolean;
	    CUSTOMRES: boolean;
	    WIDTH: number;
	    HEIGHT: number;
	
	    static createFrom(source: any = {}) {
	        return new NostalgiaCustomSettings(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.ALTTOGGLE = source["ALTTOGGLE"];
	        this.CUSTOMRES = source["CUSTOMRES"];
	        this.WIDTH = source["WIDTH"];
	        this.HEIGHT = source["HEIGHT"];
	    }
	}

}

