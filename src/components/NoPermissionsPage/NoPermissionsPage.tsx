import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Grid, EmptyStateHeader,
  } from '@patternfly/react-core';
import { LockIcon } from '@patternfly/react-icons';
import {
  PageHeader as _PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components';
import { FunctionComponent } from 'react';

const PageHeader = _PageHeader as unknown as FunctionComponent<{
  children: React.ReactNode;
}>;

export const NoPermissionsPage: React.FunctionComponent = () => (
  <>
    <PageHeader>
      <PageHeaderTitle title='Repositories' />
    </PageHeader>
    <Grid style={{ margin: '24px' }}>
      <EmptyState variant={EmptyStateVariant.full}>
        <EmptyStateHeader titleText="You do not have access to Repositories" icon={<EmptyStateIcon icon={LockIcon} />} headingLevel='h5' />
        <EmptyStateBody>
          Contact your organization administrator(s) for more information.
        </EmptyStateBody>
      </EmptyState>
    </Grid>
  </>
);
