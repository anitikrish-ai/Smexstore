import React from 'react';
import { Link } from 'react-router-dom';
import { PageLayout } from '../components/layout/PageLayout';
import { Breadcrumbs } from '../components/common/Breadcrumbs';

/** Privacy Policy. Describes only what the application does today. */
export const PrivacyPage: React.FC = () => (
  <PageLayout>
    <Breadcrumbs items={[{ label: 'Home', to: '/' }, { label: 'Privacy Policy' }]} />
    <article className="prose">
      <h1>Privacy Policy</h1>
      <p className="text-muted">Last updated: October 3, 2026</p>
      <p>
        This policy explains what information Smexstore handles when you use the site,
        why, and what choices you have.
      </p>

      <h2>Information you provide</h2>
      <ul>
        <li>
          Account details: email address, password, in-game username and in-game user ID.
        </li>
        <li>
          Profile and community content: team details, marketplace listings, ratings and
          messages you submit.
        </li>
        <li>Tournament and rank boosting activity you take part in on the site.</li>
      </ul>

      <h2>Information collected automatically</h2>
      <ul>
        <li>
          Session, device and login history shown in your account settings, used to help
          you keep your account secure.
        </li>
        <li>
          Standard technical data such as IP address and browser type, handled by our
          servers and hosting provider.
        </li>
      </ul>

      <h2>Data stored in your browser</h2>
      <p>
        Smexstore stores a small amount of data in your browser so the site works as you
        expect:
      </p>
      <ul>
        <li>Your theme and density preferences.</li>
        <li>Your sign-in session token while you are signed in.</li>
        <li>
          A marker that you have seen the welcome message, so it is not shown again.
        </li>
      </ul>
      <p>These are functional items. Smexstore does not use them for advertising.</p>

      <h2>How we use information</h2>
      <ul>
        <li>
          To create and secure your account and let you use tournaments, teams, the
          marketplace and rank boosting.
        </li>
        <li>To send account messages such as email verification and password reset.</li>
        <li>
          To prevent abuse, fraud and violations of the{' '}
          <Link to="/terms">Terms and Conditions</Link>.
        </li>
      </ul>

      <h2>Sharing</h2>
      <p>
        Content you choose to publish, such as team pages and listings, is visible to
        other users. We do not sell your personal information. We may share information
        when required by law or to protect the rights and safety of users and the
        platform.
      </p>

      <h2>Your choices</h2>
      <ul>
        <li>You can update your profile details from your account.</li>
        <li>
          You can clear data stored in your browser at any time from your browser
          settings.
        </li>
        <li>
          You can ask about access to, correction of, or deletion of your account data
          using the contact details on the <Link to="/about">About page</Link>.
        </li>
      </ul>

      <h2>Security</h2>
      <p>
        We use reasonable measures to protect information. No online service can guarantee
        absolute security, so please use a strong, unique password and keep your sign-in
        details private.
      </p>

      <h2>Children</h2>
      <p>
        Smexstore is not directed to children, and you should not use it if you are too
        young to agree to these terms where you live.
      </p>

      <h2>Changes</h2>
      <p>We may update this policy. The date at the top shows when it last changed.</p>

      <h2>Contact</h2>
      <p>
        Questions about this policy can be sent using the contact details on the{' '}
        <Link to="/about">About page</Link>.
      </p>
    </article>
  </PageLayout>
);
