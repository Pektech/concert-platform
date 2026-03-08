import { render, screen } from '@testing-library/react';

describe('Example Test', () => {
  it('should render text correctly', () => {
    render(<div>Hello Vitest</div>);
    expect(screen.getByText('Hello Vitest')).toBeInTheDocument();
  });
});
