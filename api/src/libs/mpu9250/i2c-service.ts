/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-mixed-spaces-and-tabs */
import { runningOnRasberry } from "../runningOnRasberry"

const i2c = runningOnRasberry ? require("i2c") : require("./facticeI2c").i2c

export class I2cService extends i2c {
	constructor(address: number, options: { device: string; debug?: boolean }) {
		super(address, options)
	}

	public writeBytes(adrs: number, buffer: number[] | Buffer | any, callback?: (...args: any) => void): void {
		callback = callback instanceof Function ? callback : () => 0
		super.writeBytes(adrs, buffer, callback)
	}

	public writeBytesAsync(adrs: number, buffer: number[] | Buffer | any): Promise<void> {
		return new Promise((resolve, reject) => {
			this.writeBytes(adrs, buffer, (err) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	public readBytes(adrs: number, length: number, callback?: (...args: any) => void): any {
		callback = callback instanceof Function ? callback : () => 0
		return super.readBytes(adrs, length, callback)
	}

	public readBytesAsync(adrs: number, length: number): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			const buffer = this.readBytes(adrs, length, (err) => {
				if (err) {
					reject(err)
				} else {
					resolve(buffer)
				}
			})
		})
	}

	public bitMask(bit: number, length: number): number {
		return ((1 << length) - 1) << bit
	}

	public readByte(adrs: number, callback?: (...args: any) => void): number {
		callback = callback instanceof Function ? callback : () => 0
		const buf = this.readBytes(adrs, 1, callback)
		if (!buf) return 0
		return buf[0]
	}

	public readByteAsync(adrs: number): Promise<number> {
		return new Promise((resolve, reject) => {
			const byte = this.readByte(adrs, (err) => {
				if (err) {
					reject(err)
				} else {
					resolve(byte)
				}
			})
		})
	}

	public readBit(adrs: number, bit: number, callback?: (...args: any) => void): number {
		callback = callback instanceof Function ? callback : () => 0
		const buf = this.readByte(adrs, callback)
		return (buf >> bit) & 1
	}

	public readBitAsync(adrs: number, bit: number): Promise<number> {
		return new Promise((resolve, reject) => {
			const _bit = this.readBit(adrs, bit, (err) => {
				if (err) {
					reject(err)
				} else {
					resolve(_bit)
				}
			})
		})
	}

	public writeBits(adrs: number, bit: number, length: number, value: number, callback?: (...args: any) => void): void {
		callback = callback instanceof Function ? callback : () => 0
		const oldValue = this.readByte(adrs, () => {
			/** no action */
		})
		const mask = this.bitMask(bit, length)
		const newValue = oldValue ^ ((oldValue ^ (value << bit)) & mask)
		this.writeBytes(adrs, [newValue], callback)
	}

	/** Async method */
	public writeBitsAsync(adrs: number, bit: number, length: number, value: number): Promise<void> {
		return new Promise((resolve, reject) => {
			this.writeBits(adrs, bit, length, value, (err) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}

	public writeBit(adrs: number, bit: number, value: number, callback?: (...args: any) => void): void {
		callback = callback = callback instanceof Function ? callback : () => 0
		this.writeBits(adrs, bit, 1, value, callback)
	}

	/** Async method */

	public writeBitAsync(adrs: number, bit: number, value: 0 | 1): Promise<void> {
		return new Promise((resolve, reject) => {
			this.writeBit(adrs, bit, value, (err) => {
				if (err) {
					reject(err)
				} else {
					resolve()
				}
			})
		})
	}
}
