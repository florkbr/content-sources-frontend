import { act, fireEvent, render } from '@testing-library/react';
import {
  defaultValidationErrorData,
  passingValidationErrorData,
  ReactQueryTestWrapper,
} from '../../../../testingHelpers';
import AddContent from './AddContent';
import {
  useAddContentQuery,
  useFetchGpgKey,
  useValidateContentList,
} from '../../../../services/Content/ContentQueries';
import useDebounce from '../../../../services/useDebounce';

jest.mock('../../../../services/Content/ContentQueries', () => ({
  useAddContentQuery: jest.fn(),
  useValidateContentList: jest.fn(),
  useFetchGpgKey: jest.fn(),
}));

jest.mock('../../../../services/useDebounce', () => jest.fn());

const passingValidationMetaDataSigNotPresent = [
  {
    ...passingValidationErrorData[0],
    url: { ...passingValidationErrorData[0], metadata_signature_present: false },
  },
];

it('expect AddContent button to render and be disabled', () => {
  (useAddContentQuery as jest.Mock).mockImplementation(() => ({ isLoading: false }));
  (useValidateContentList as jest.Mock).mockImplementation(() => ({
    isLoading: false,
    mutateAsync: async () => defaultValidationErrorData,
  }));
  (useFetchGpgKey as jest.Mock).mockImplementation(() => ({ fetchGpgKey: () => '' }));

  const { queryByText } = render(
    <ReactQueryTestWrapper>
      <AddContent isLoading />
    </ReactQueryTestWrapper>,
  );

  const button = queryByText('Add repositories');
  expect(button).toBeInTheDocument();
  expect(button).toHaveAttribute('disabled');
});

it('expect AddContent modal to open/close successfully', async () => {
  (useAddContentQuery as jest.Mock).mockImplementation(() => ({ isLoading: false }));
  (useValidateContentList as jest.Mock).mockImplementation(() => ({
    isLoading: false,
    mutateAsync: async () => defaultValidationErrorData,
  }));
  (useDebounce as jest.Mock).mockImplementation((value) => value);
  (useFetchGpgKey as jest.Mock).mockImplementation(() => ({ fetchGpgKey: () => '' }));

  const { queryByText } = render(
    <ReactQueryTestWrapper>
      <AddContent />
    </ReactQueryTestWrapper>,
  );

  const button = queryByText('Add repositories');
  expect(button).toBeInTheDocument();
  await act(async () => {
    button?.click();
  });
  expect(queryByText('Add custom repositories')).toBeInTheDocument();
  await act(async () => {
    queryByText('Cancel')?.click();
  });
  expect(queryByText('Add custom repositories')).not.toBeInTheDocument();
});

it('expect "name" input to show a validation error', async () => {
  (useAddContentQuery as jest.Mock).mockImplementation(() => ({ isLoading: false }));
  (useValidateContentList as jest.Mock).mockImplementation(() => ({
    isLoading: false,
    mutateAsync: async () => defaultValidationErrorData,
  }));
  (useDebounce as jest.Mock).mockImplementation((value) => value);
  (useFetchGpgKey as jest.Mock).mockImplementation(() => ({ fetchGpgKey: () => '' }));

  const { queryByText, queryByPlaceholderText } = render(
    <ReactQueryTestWrapper>
      <AddContent />
    </ReactQueryTestWrapper>,
  );

  const button = queryByText('Add repositories');
  expect(button).toBeInTheDocument();
  await act(async () => {
    button?.click();
  });
  const nameInput = queryByPlaceholderText('Enter name');
  expect(nameInput).toBeInTheDocument();
  if (nameInput) {
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'b' } });
      fireEvent.blur(nameInput);
    });
  }
  expect(queryByText('Too Short!')).toBeInTheDocument();
});

it('expect "url" input to show a validation error', async () => {
  (useAddContentQuery as jest.Mock).mockImplementation(() => ({ isLoading: false }));
  (useValidateContentList as jest.Mock).mockImplementation(() => ({
    isLoading: false,
    mutateAsync: async () => defaultValidationErrorData,
  }));
  (useDebounce as jest.Mock).mockImplementation((value) => value);
  (useFetchGpgKey as jest.Mock).mockImplementation(() => ({ fetchGpgKey: () => '' }));

  const { queryByText, queryByPlaceholderText } = render(
    <ReactQueryTestWrapper>
      <AddContent />
    </ReactQueryTestWrapper>,
  );

  const button = queryByText('Add repositories');
  expect(button).toBeInTheDocument();
  await act(async () => {
    button?.click();
  });
  const urlInput = queryByPlaceholderText('https://');
  expect(urlInput).toBeInTheDocument();
  if (urlInput) {
    await act(async () => {
      fireEvent.change(urlInput, { target: { value: 'bobTheBuilder' } });
      fireEvent.blur(urlInput);
    });
  }
  expect(queryByText('Invalid URL')).toBeInTheDocument();
});

it('expect "Package and metadata verification" to be pre-selected', async () => {
  (useAddContentQuery as jest.Mock).mockImplementation(() => ({ isLoading: false }));
  (useValidateContentList as jest.Mock).mockImplementation(() => ({
    isLoading: false,
    mutateAsync: async () => passingValidationErrorData,
    data: passingValidationErrorData,
  }));
  (useDebounce as jest.Mock).mockImplementation((value) => value);

  const { queryByText, queryByPlaceholderText, queryByLabelText } = render(
    <ReactQueryTestWrapper>
      <AddContent />
    </ReactQueryTestWrapper>,
  );

  const button = queryByText('Add repositories');
  expect(button).toBeInTheDocument();
  await act(async () => {
    button?.click();
  });
  const urlInput = queryByPlaceholderText('https://');
  expect(urlInput).toBeInTheDocument();
  if (urlInput) {
    await act(async () => {
      fireEvent.change(urlInput, { target: { value: 'https://bobTheBuilder.com' } });
      fireEvent.blur(urlInput);
    });
  }
  expect(queryByText('Invalid URL')).not.toBeInTheDocument();
  const gpgKeyInput = queryByPlaceholderText('Paste GPG key or URL here');
  expect(gpgKeyInput).toBeInTheDocument();
  if (gpgKeyInput) {
    await act(async () => {
      fireEvent.change(gpgKeyInput, { target: { value: 'aRealGPGKey' } });
    });
  }

  expect(queryByText('Package and metadata verification')).toBeInTheDocument();
  const packageMetaDataInput = queryByLabelText('Package and metadata verification');

  expect(packageMetaDataInput).toHaveAttribute('checked');
});

it('expect "Package verification only" to be pre-selected', async () => {
  (useAddContentQuery as jest.Mock).mockImplementation(() => ({ isLoading: false }));

  (useValidateContentList as jest.Mock).mockImplementation(() => ({
    isLoading: false,
    mutateAsync: async () => passingValidationMetaDataSigNotPresent,
    data: passingValidationMetaDataSigNotPresent,
  }));
  (useDebounce as jest.Mock).mockImplementation((value) => value);

  const { queryByText, queryByPlaceholderText, queryByLabelText } = render(
    <ReactQueryTestWrapper>
      <AddContent />
    </ReactQueryTestWrapper>,
  );

  const button = queryByText('Add repositories');
  expect(button).toBeInTheDocument();
  await act(async () => {
    button?.click();
  });
  const urlInput = queryByPlaceholderText('https://');
  expect(urlInput).toBeInTheDocument();
  if (urlInput) {
    await act(async () => {
      fireEvent.change(urlInput, { target: { value: 'https://bobTheBuilder.com' } });
    });
  }
  expect(queryByText('Invalid URL')).not.toBeInTheDocument();
  const gpgKeyInput = queryByPlaceholderText('Paste GPG key or URL here');
  expect(gpgKeyInput).toBeInTheDocument();
  if (gpgKeyInput) {
    await act(async () => {
      fireEvent.change(gpgKeyInput, { target: { value: 'aRealGPGKey' } });
      fireEvent.blur(gpgKeyInput);
    });
  }
  expect(queryByText('Package verification only')).toBeInTheDocument();
  const packageVerificationOnly = queryByLabelText('Package verification only');
  expect(packageVerificationOnly).toHaveAttribute('checked');
});

it('Add content', async () => {
  (useAddContentQuery as jest.Mock).mockImplementation(() => ({
    isLoading: false,
    mutateAsync: async () => null,
  }));
  (useValidateContentList as jest.Mock).mockImplementation(() => ({
    isLoading: false,
    mutateAsync: async () => passingValidationErrorData,
    data: passingValidationErrorData,
  }));
  (useDebounce as jest.Mock).mockImplementation((value) => value);
  (useFetchGpgKey as jest.Mock).mockImplementation(() => ({ fetchGpgKey: () => '' }));

  const { queryByText, queryByPlaceholderText, queryAllByText } = render(
    <ReactQueryTestWrapper>
      <AddContent />
    </ReactQueryTestWrapper>,
  );

  const button = queryByText('Add repositories');
  expect(button).toBeInTheDocument();
  await act(async () => {
    button?.click();
  });

  const nameInput = queryByPlaceholderText('Enter name');
  expect(nameInput).toBeInTheDocument();
  const urlInput = queryByPlaceholderText('https://');
  expect(urlInput).toBeInTheDocument();
  const gpgKeyInput = queryByPlaceholderText('Paste GPG key or URL here');
  if (urlInput && nameInput && gpgKeyInput) {
    await act(async () => {
      fireEvent.change(urlInput, { target: { value: 'https://google.com/' } });
    });
    await act(async () => {
      fireEvent.change(nameInput, { target: { value: 'superCoolName' } });
    });
    await act(async () => {
      fireEvent.change(gpgKeyInput, { target: { value: 'test gpg key' } });
    });
    await act(async () => {
      fireEvent.blur(urlInput);
    });
    await act(async () => {
      fireEvent.blur(nameInput);
    });
    await act(async () => {
      fireEvent.blur(gpgKeyInput);
    });
  }

  expect(queryByText('Use GPG key for')).toBeInTheDocument();
  expect(queryByText('test gpg key')).toBeInTheDocument();

  expect(queryByText('Invalid URL')).not.toBeInTheDocument();
  const addAnotherButton = queryByText('Add another repository');
  expect(addAnotherButton?.getAttribute('disabled')).toBeNull();
  if (addAnotherButton) {
    await act(async () => {
      fireEvent.click(addAnotherButton);
    });
  }
  const secondRemoveButton = queryAllByText('Remove')[1];
  expect(secondRemoveButton).toBeInTheDocument();
  if (secondRemoveButton) {
    await act(async () => {
      fireEvent.click(secondRemoveButton);
    });
  }
  const saveButton = queryByText('Save');
  expect(saveButton?.getAttribute('disabled')).toBeNull();
  if (saveButton) {
    await act(async () => {
      fireEvent.click(saveButton);
    });
  }
  expect(queryByText('Add custom repository')).not.toBeInTheDocument();
});