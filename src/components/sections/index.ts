import type { FC } from 'react';
import type { SectionId } from '../../content';
import { Contact } from './Contact';
import { Expertise } from './Expertise';
import { Hero } from './Hero';
import { About, DataScience, Education, Process, Toolkit } from './Info';

export { Footer, Header, Ticker } from './Chrome';

export const SECTION_COMPONENTS: Record<SectionId, FC> = {
  home: Hero,
  expertise: Expertise,
  about: About,
  process: Process,
  data: DataScience,
  toolkit: Toolkit,
  education: Education,
  contact: Contact,
};
