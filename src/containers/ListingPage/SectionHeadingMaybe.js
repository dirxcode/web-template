import React from 'react';
import { Heading } from '../../components';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';
import classNames from 'classnames';

const MIN_LENGTH_FOR_LONG_WORDS = 20;

const SectionHeadingMaybe = props => {
  const { text, heading, showAsIngress = false } = props;
  const textClass = showAsIngress ? css.ingress : css.text;
  const content = richText(text, {
    longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
    longWordClass: css.longWord,
    breakChars: '/',
  });

  return heading ? (
    <section className={css.justHeadingText}>
        <Heading as={"h4"}>
          {heading}
        </Heading>
    </section>
  ) : null;
};

export default SectionHeadingMaybe;
