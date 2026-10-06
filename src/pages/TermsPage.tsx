import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

/** Terms and Conditions. Describes only features that exist in the application. */
export const TermsPage: React.FC = () => (
  <PageLayout>
    <Breadcrumbs
      items={[{ label: 'Home', to: '/' }, { label: 'Terms and Conditions' }]}
    />
    <article className="prose">
      <h1>Terms and Conditions</h1>
      <p className="text-muted">Last updated: October 3, 2026</p>
      <p>
        By using Smexstore you agree to these terms. If you do not agree, please do not
        use the site.
      </p>

      <h2>Your account</h2>
      <ul>
        <li>
          You must provide accurate information and keep your sign-in details private.
        </li>
        <li>You are responsible for activity that happens under your account.</li>
        <li>One person should not run multiple accounts to gain an unfair advantage.</li>
      </ul>

      <h2>Community conduct</h2>
      <ul>
        <li>Do not cheat, harass other users, or use the site for unlawful activity.</li>
        <li>Do not post content that is false, misleading, infringing or harmful.</li>
        <li>Tournament rules published on a tournament page apply to that tournament.</li>
      </ul>

      <h2>Marketplace and services</h2>
      <ul>
        <li>
          Listings are created by community sellers. Check a listing carefully before you
          commit to anything.
        </li>
        <li>
          Game publishers have their own rules about account transfers and third-party
          services. You are responsible for following the rules of any game you play.
        </li>
        <li>
          Rank boosting packages are described on their pages. Review the details before
          you book.
        </li>
      </ul>

      <h2>Your content</h2>
      <p>
        You keep ownership of content you submit. You give Smexstore permission to display
        it on the site for the purpose of running the service.
      </p>

      <h2>Suspension and removal</h2>
      <p>
        We may remove content or restrict accounts that break these terms or put other
        users or the platform at risk.
      </p>

      <h2>Availability and liability</h2>
      <p>
        Smexstore is provided as is. Features may change or be unavailable from time to
        time. To the extent the law allows, Smexstore is not liable for indirect or
        consequential loss arising from use of the site.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle information is described in the{' '}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>

      <h2>Changes</h2>
      <p>
        We may update these terms. Continuing to use the site after a change means you
        accept the updated terms.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about these terms can be sent using the contact details on the{' '}
        <Link to="/about">About page</Link>.
      </p>
    </article>
  </PageLayout>
);
