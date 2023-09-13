import { Default } from "./default.interface";

export interface InputInterface {
    type: string,
	name: string,
	value: string,
	object: Default | Default[],
	readOnly: boolean,
	show: boolean,
}