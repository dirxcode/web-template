import React from 'react';
import { Heading } from '../../components';
import { richText } from '../../util/richText';

import css from './ListingPage.module.css';
import classNames from 'classnames';

const MIN_LENGTH_FOR_LONG_WORDS = 20;

const SectionMeetUp = props => {
  const { text, heading, showAsIngress = false } = props;
  const textClass = showAsIngress ? css.ingress : css.text;
  const content = richText(text, {
    longWordMinLength: MIN_LENGTH_FOR_LONG_WORDS,
    longWordClass: css.longWord,
    breakChars: '/',
  });

  

  return text ? (
    <section className={css.sectionText}>
      {heading ? (
        <Heading as={"h4"}>
          {heading}
        </Heading>
      ) : null}
      <ul className={classNames(css.root, css.twoColumns)}>
        <p className={textClass}>{content}</p>
      </ul>
    </section>
  ) : null;
};

export default SectionMeetUp;
