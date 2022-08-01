import { html } from 'lit';
import { fixture, expect } from '@open-wc/testing';

import { BrickEdit } from '../src/component/BrickEdit.js';
import '../src/component/brick-edit.js';

describe('BrickEdit', () => {
  let element: BrickEdit;
  beforeEach(async () => {
    element = await fixture(html`<brick-edit></brick-edit>`);
  });

  it('passes the a11y audit', async () => {
    await expect(element).shadowDom.to.be.accessible();
  });
});
