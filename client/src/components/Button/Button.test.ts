
import { cleanup, fireEvent, render } from '@testing-library/react';
import Button from './Button';

// Note: running cleanup afterEach is done automatically for you in @testing-library/react@9.0.0 or higher
// unmount and cleanup DOM after the test is finished.
afterEach(cleanup);

function renderButton(props: Partial<any> = {}) {
    const defaultProps: any = {
        onClick() {
            return;
        },
        children: "This is children"
    };
    //return render(<Button{ ...defaultProps } { ...props } />);
}

it('Button changes the text after click', () => {
    const { queryByLabelText, getByLabelText } = render(
        <Button />,
    );

    expect(queryByLabelText(/off/i)).toBeTruthy();

    fireEvent.click(getByLabelText(/off/i));

    expect(queryByLabelText(/on/i)).toBeTruthy();
})