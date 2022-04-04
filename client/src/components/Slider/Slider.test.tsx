/* eslint-disable testing-library/prefer-screen-queries */
import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import Slider from "./Slider"

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup)

describe("Test Slider component", () => {
	it("Slider should be rendered with text 'This is slider'", () => {
		render(<Slider label="This is slider" />)
		expect(screen.getByText("This is slider")).toBeTruthy()
	})

	it("Test value change event", () => {
		render(<Slider label="Test" />)

		fireEvent.change(screen.getByLabelText("number-input"), { target: { value: "23" } })
		// @ts-ignore
		expect(screen.getByLabelText("number-input").value).toBe("23")
	})
})
