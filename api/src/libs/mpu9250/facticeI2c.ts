/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-mixed-spaces-and-tabs */

export class i2c {
	address: number
	options: { device: string; debug?: boolean }

	constructor(address: number, options: { device: string; debug?: boolean }) {
		this.address = address
		this.options = options
	}

	public writeBytes(_adrs: number, _buffer: number[] | Buffer | any, _callback?: (...args: any) => void): void {
		console.log("writeBytes")
	}

	public writeBytesAsync(_adrs: number, _buffer: number[] | Buffer | any) {
		console.log("writeBytesAsync")
	}

	public readBytes(_adrs: number, _length: number, _callback?: (...args: any) => void) {
		console.log("readBytes")
	}

	public readBytesAsync(_adrs: number, _length: number) {
		console.log("readBytesAsync")
	}

	public bitMask(bit: number, length: number): number {
		return ((1 << length) - 1) << bit
	}

	public readByte(adrs: number, callback?: (...args: any) => void): number {
		callback = callback instanceof Function ? callback : () => console.log("No callback")
		const buf: any = this.readBytes(adrs, 1, callback)
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
		callback = callback instanceof Function ? callback : () => console.log("No callback")
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
		callback = callback instanceof Function ? callback : () => console.log("No callback")
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
		callback = callback = callback instanceof Function ? callback : () => console.log("No callback")
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
