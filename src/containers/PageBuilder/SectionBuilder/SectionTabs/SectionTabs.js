import React, { useState } from 'react';
import { useIntl } from '../../../../util/reactIntl';
import { arrayOf, bool, func, node, number, object, shape, string } from 'prop-types';
import classNames from 'classnames';
import Field, { hasDataInFields } from '../../Field';
import SectionContainer from '../SectionContainer';
import css from './SectionTabs.module.css';
import { SecondaryButton } from '../../../../components/Button/Button';
import { H2, H4 } from '../../../../components';

const getIndex = numColumns => numColumns - 1;
const getColumnCSS = numColumns => {
  const config = COLUMN_CONFIG[getIndex(numColumns)];
  return config ? config.css : COLUMN_CONFIG[0].css;
};

const tabs = [
    { label: 'Lender', content: <div>Content for Tab 1</div>, data:[{label:"Sign up", content:"Signing up and getting verified on Lendit takes a couple of minutes."},{label:"List your items", content:"<p>Take a picture of idle items lying around, set your price and terms.<br><br>It's free to list!</p>"},{label:"Accept offers", content:"<p>Check your inbox to see if you’ve received rental requests. If it works, click accept! <br><br> Schedule a time or delivery method between you and the renter that’s convenient.</p>"},{label:"Get Paid!", content:"<p>Payment will be made to your account anywhere between 5-14 business days (there maybe additional delays depending on your bank’s processing time) <br><br> Keep an eye on your account!</p>"}] },
    { label: 'Renter', content: <div>Content for Tab 2</div>,data:[{label:"Sign up", content:"Signing up and getting verified on Lendit takes a couple of minutes."},{label:"Find an item nearby", content:"<p>Search for the items you’re looking for and filter by type.</p>"},{label:"Request and book", content:"<p>Send a request to the lender for the dates you’d like the items. When they accept your request, you’re ready to book by the items by paying.</p>"},{label:"Collect and enjoy!", content:"<p>Set a delivery method between you and the Lender. <br><br> Enjoy and treat these precious items as if they were yours! <br><br> Return your items before the due date to avoid penalties! </p>"},] },
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
                      <div dangerouslySetInnerHTML={{ __html: content }} />
                  </div>
              ))}
          </div>
       );
      }
      });
      

    return blocks;
  };

    return (
        <>
          <div className='SectionTabs_mBottom__VgE1o'></div>
          <header className={defaultClasses.sectionDetails}>
            <center>
            <h2 className="Heading_h2__rNLtP SectionBuilder_title__fPMOM SectionBuilder_align__WNhQa">How it works</h2>
            <p className='Ingress_ingress__gvK1A SectionBuilder_description__A7dhl SectionBuilder_align__WNhQa'>Access items without owning them by renting them from people in your neighborhood in a few easy steps</p>
            </center>
          </header>
          <div className='SectionTabs_mBottom__VgE1o'></div>
          <div className="SectionTabs_Tabs__G9avD" style={{ background: 'white', width: '100%' }}>
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
        </>
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