import {
	SelectVariant
} from '@patternfly/react-core/deprecated';
import { render } from '@testing-library/react';
import DropDownSelect from './DropdownSelect';

it('Render with SelectVariant.single', () => {
  const { queryByText } = render(
    <DropDownSelect
      selectedProp='1'
      options={['1', '2', '3', '4']}
      variant={SelectVariant.single}
      setSelected={() => null}
    />,
  );
  const SelectComponent = queryByText('1');
  expect(SelectComponent).toBeInTheDocument();
  SelectComponent?.click();
  expect(queryByText('2')).toBeInTheDocument();
  expect(queryByText('3')).toBeInTheDocument();
  expect(queryByText('4')).toBeInTheDocument();
  queryByText('4')?.click();
});

it('Render with SelectVariant.multi', () => {
  const { queryAllByText, queryByText, queryByRole } = render(
    <DropDownSelect
      aria-label='dropdown'
      selectedProp={['1', '2']}
      options={['1', '2', '3', '4']}
      variant={SelectVariant.typeaheadMulti}
      setSelected={() => null}
    />,
  );

  const textbox = queryByRole('textbox');
  expect(textbox).toBeInTheDocument();
  expect(queryByText('1')).toBeInTheDocument();
  expect(queryByText('2')).toBeInTheDocument();
  expect(queryByText('3')).not.toBeInTheDocument();
  expect(queryByText('4')).not.toBeInTheDocument();
  textbox?.click();
  expect(queryByText('3')).toBeInTheDocument();
  expect(queryByText('4')).toBeInTheDocument();
  queryByText('4')?.click();
  queryAllByText('1')[1]?.click();
});
