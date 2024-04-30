import React, { useState } from 'react';
import { useIntl } from '../../../../util/reactIntl';
import { arrayOf, bool, func, node, number, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import Field, { hasDataInFields } from '../../Field';
import SectionContainer from '../SectionContainer';
import css from './SectionTabs.module.css';
import Button, { PrimaryButton, SecondaryButton, InlineTextButton } from '../../../../components/Button/Button';

// console.log("css.txtTabs",css.txtTabs);
const getIndex = numColumns => numColumns - 1;
const getColumnCSS = numColumns => {
  const config = COLUMN_CONFIG[getIndex(numColumns)];
  return config ? config.css : COLUMN_CONFIG[0].css;
};

const tabs = [
    { label: 'Lender', content: <div>Content for Tab 1</div>, data:[{label:"Sign up", content:"Signing up and getting verified on Lendit takes a couple of minutes."},{label:"List your items", content:"Take a picture of idle items lying around, set your price and terms free to list!"},{label:"Accept offers", content:"Check your inbox to see if you’ve received rental requests.\nIf it works, click accept! Schedule a time or delivery method between you and the renter that’s convenient."},{label:"Get Paid!", content:"Payment will be made to your account anywhere between 5-14 business days (there maybe additional delays depending on your bank’s processing time)\nKeep an eye on your account!"}] },
    { label: 'Renter', content: <div>Content for Tab 2</div>,data:[{label:"Sign up", content:"Signing up and getting verified on Lendit takes a couple of minutes."},{label:"Find an item nearby", content:"Search for the items you’re looking for and filter by type"},{label:"Request and book", content:"Send a request to the lender for the dates you’d like the items. When they accept your request, you’re ready to book by the items by paying"},{label:"Collect and enjoy!", content:"Set a delivery method between you and the Lender. Enjoy and treat these precious items as if they were yours! Return your items before the due date to avoid penalties!"},] },
];


const SectionTabs = props => {
    const {
      sectionId,
      className,
      rootClassName,
      defaultClasses,
      numColumns,
      title,
      description,
      appearance,
      callToAction,
      isInsideContainer,
      options,
      listings,
    } = props;

    const intl = useIntl();

    const [activeTab, setActiveTab] = useState(0);

    // Function to handle tab clicks
    const handleTabClick = (index) => {
        setActiveTab(index);
    };

    const goToSignUp = () => {
      window.location.href = '/signup';
  };

    // If external mapping has been included for fields
    // E.g. { h1: { component: MyAwesomeHeader } }
    const fieldComponents = options?.fieldComponents;
    const fieldOptions = { fieldComponents };

    // Function to split data into four columns
    const renderDataColumns = (data) => {
      const chunkSize = Math.ceil(data.length / 4);
      const columns = [[], [], [], []];

      // Distribute data into columns
      data.forEach((item, index) => {
          const columnIndex = index % 4;
          columns[columnIndex].push(item);
      });

      let blocks = columns.map((column, index) => {
        if(index==0){
          return (
            <div key={index} className="SectionTabs_column__3S5Qy">
                {column.map(({ label, content }) => (
                    <div key={label}>
                        <div className='SectionTabs_txtLabel__uw6c7'>{label}</div>
                        <p>{content}</p>
                        <div className='SectionTabs_btnStart__7odMI'>
                            <SecondaryButton onClick={goToSignUp}>
                              <span>Get Started</span>
                            </SecondaryButton>
                        </div>
                    </div>
                ))}
            </div>
         );
        }else{
        return (
          <div key={index} className="SectionTabs_column__3S5Qy">
              {column.map(({ label, content }) => (
                  <div key={label}>
                      <div className='SectionTabs_txtLabel__uw6c7'>{label}</div>
                      <p>{content}</p>
                  </div>
              ))}
          </div>
       );
      }
      });
      

    return blocks;
  };

    // console.log("Css",css);
    return (
        <SectionContainer
          id={sectionId}
          className={className}
          rootClassName={css.root}
          appearance={appearance}
          options={fieldOptions}
        >
            <div className="SectionTabs_Tabs__G9avD">
                <ul className="SectionTabs_nav__QMNQ4">
                    {/* Map over tabs and render them */}
                    {tabs.map((tab, index) => (
                        <li 
                            key={index} 
                            onClick={() => handleTabClick(index)}
                            className={index === activeTab ? 'SectionTabs_active__Ymnp8' : ''}
                        >
                          <div className='SectionTabs_txtLabel__uw6c7'> {tab.label}</div>
                        </li>
                    ))}
                </ul>
                {/* Render content based on active tab */}
                <div className="SectionTabs_outlet__ggIfZ">
                    {renderDataColumns(tabs[activeTab].data)}
                </div>
            </div>
        </SectionContainer>
      );
};


const propTypeOption = shape({
    fieldComponents: shape({ component: node, pickValidProps: func }),
  });
  
  SectionTabs.defaultProps = {
    className: null,
    rootClassName: null,
    defaultClasses: null,
    textClassName: null,
    numColumns: 1,
    title: null,
    description: null,
    appearance: null,
    callToAction: null,
    blocks: [],
    isInsideContainer: false,
    options: null,
  };
  
  SectionTabs.propTypes = {
    sectionId: string.isRequired,
    className: string,
    rootClassName: string,
    defaultClasses: shape({
      sectionDetails: string,
      title: string,
      description: string,
      ctaButton: string,
    }),
    numColumns: number,
    title: object,
    description: object,
    appearance: object,
    callToAction: object,
    blocks: arrayOf(object),
    isInsideContainer: bool,
    options: propTypeOption,
    listing:object,
  };
  
  export default SectionTabs;