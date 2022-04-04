import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import Button from "./Button"

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup)

describe("Test Button component", () => {
	it("Button should render text 'Some Text'", () => {
		render(<Button>Some Text</Button>)
		expect(screen.getByText("Some Text")).toBeTruthy()
	})

	it("Test click event", () => {
		const mockCallBack = jest.fn()

		render(<Button onClick={mockCallBack}>test</Button>)

		fireEvent.click(screen.getByText("test"))

		expect(mockCallBack.mock.calls.length).toEqual(1)
	})
})
