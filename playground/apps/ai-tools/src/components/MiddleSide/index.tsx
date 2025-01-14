import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.css';
import { Input, Select, Button } from '@chakra-ui/react';
import flows from './flow.json';
import models from './models.json';
import { v4 as uuidv4 } from 'uuid';

const MiddleSide = () => {
  const [selectedFlow, setSelectedFlow] = useState<null | number>(null);
  const [selectedState, setSelectedState] = useState(0);
  // Need to get this data from API
  // const services = [
  //   'text_lang_detection_bhashini',
  //   'text_translation_bhashini',
  //   'text_translation_google',
  //   't2embedding_openai',
  //   'llm_openai_gpt3',
  // ];
  // const xstateFunctions = ['api_call', 'get_history', 'send_response'];
  // const errorHandlers = ['handle_error'];

  const GI = ({ identifier }: any) => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '1vh' }}>
        <h3>Guard</h3>
        <div>
          {/* @ts-ignore */}
          <Select placeholder="N/A">
            <option value="if null">if null</option>
            <option value="if null">if empty array</option>
            <option value="if null">if error</option>
          </Select>
        </div>
        <h3>Invoke</h3>
        <div>
          {selectedFlow !== null ? (
            <Select placeholder="N/A">
              {flows[selectedFlow].states.map((xstate, i) => (
                <option key={i} value={xstate.name}>
                  {xstate.name}
                </option>
              ))}
            </Select>
          ) : null}
        </div>
        <div
          onClick={() => {
            deleteHandler(identifier);
          }}>
          <Button color="black" size="sm" marginLeft={2}>
            -
          </Button>
        </div>
      </div>
    );
  };

  const [guardInvokeList, setGuardInvokeList] = useState<React.ReactNode[]>([]);

  const onAddBtnClick = () => {
    setGuardInvokeList((prevState) => {
      const identifier = uuidv4();
      const newComponent = <GI key={identifier} identifier={identifier} />;
      return [...prevState, newComponent];
    });
  };

  const deleteHandler = useCallback(
    (key: any) => {
      setGuardInvokeList((prevState) => {
        const updatedList = prevState.filter(
          (GI: any) => GI.props.identifier !== key
        );
        return updatedList;
      });
      console.log(guardInvokeList);
    },
    [guardInvokeList]
  );

  const renderFlow = (state: any) => {
    let onDoneStr = '';
    if (Array.isArray(state.onDone)) {
      onDoneStr = state.onDone
        .map((item: any) =>
          typeof item === 'string' ? item : `${item.guard} : ${item.invoke}`
        )
        .join(' else ');
    } else {
      onDoneStr = state.onDone;
    }
    return (
      <div key={state.name}>
        <strong>{state.name}</strong>
        <p>
          (On Done: {onDoneStr}, On Error: {state.onError})
        </p>
      </div>
    );
  };

  return (
    <div className={styles.main}>
      <h2 className={styles.header}>EDITOR</h2>

      <div className={styles.flowContainer}>
        <h3>Select Flow</h3>
        {/* //@ts-ignore */}
        <Select
          placeholder="None"
          value={selectedFlow === null ? '' : selectedFlow}
          onChange={(e) =>
            setSelectedFlow(e.target.value ? Number(e.target.value) : null)
          }>
          {['Flow 1', 'Flow 2', 'Flow 3'].map((flow, i) => (
            <option key={flow} value={i}>
              {flow}
            </option>
          ))}
        </Select>
      </div>

      {selectedFlow !== null && (
        <>
          <div className={styles.linebreak}></div>
          <div style={{ display: 'flex' }}>
            <div style={{ flex: 0.5 }}>
              <h3 style={{ fontWeight: 'bold' }}>States</h3>
              <div className={styles.flowDisplay}>
                {flows[selectedFlow].states.map((state, i) => (
                  <div
                    key={i}
                    className={`${styles.state}${
                      i == selectedState ? ' ' + styles.selectedState : ''
                    }`}
                    onClick={() => setSelectedState(i)}>
                    <p>{state.name}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ flex: 0.5 }}>
              <h3 style={{ fontWeight: 'bold' }}>Flow</h3>
              <div>{flows[selectedFlow].states.map(renderFlow)}</div>
            </div>
          </div>

          <div className={styles.linebreak}></div>

          <h3 className={styles.editFlowHeading}>Edit Flow</h3>
          <div className={styles.editFlowContainer}>
            <div>
              <h3>Name</h3>
              {/* @ts-ignore */}
              <Input
                placeholder="Enter name"
                value={flows[selectedFlow]?.states[selectedState]?.name}
                isDisabled
              />
            </div>
            <div>
              {flows[selectedFlow]?.states[selectedState]?.service_type !==
                null && (
                <>
                  <h3>Service Type</h3>
                  <Select
                    placeholder="Select Service Type"
                    defaultValue={
                      flows[selectedFlow]?.states[selectedState]
                        ?.service_type || ''
                    }>
                    {models
                      .filter(
                        (model: any) =>
                          model.service_category_name ===
                          flows[selectedFlow]?.states[selectedState]?.name
                      )
                      .map((filteredModel, i) => {
                        return (
                          <option
                            value={filteredModel.service_type || ''}
                            key={i}>
                            {filteredModel.name}
                          </option>
                        );
                      })}
                  </Select>
                </>
              )}
            </div>
            <div>
              <h3>Function</h3>
              <Input
                isDisabled
                value={
                  flows[selectedFlow]?.states[selectedState]?.function || ''
                }
              />{' '}
            </div>
            <div>
              {flows[selectedFlow]?.states[selectedState]?.service_type !==
                null && (
                <>
                  <h3>Service</h3>
                  <Input
                    placeholder="Service name"
                    isDisabled
                    value={`${
                      flows[selectedFlow]?.states[selectedState]?.service_type +
                        '-' || ''
                    }${flows[selectedFlow]?.states[selectedState]?.function}`}
                  />
                </>
              )}
            </div>
            <div className={styles.onDone}>
              <h3>On Done</h3>
              <div className={styles.onDoneSelects}>
                <Select placeholder="On Done">
                  {flows[selectedFlow].states.map((xstate, i) => (
                    <option key={i} value={xstate.name}>
                      {xstate.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className={styles.addButton} onClick={onAddBtnClick}>
                <Button color="black" size="sm">
                  +
                </Button>
              </div>
            </div>
            <div className={styles.guardInvoke}>{guardInvokeList}</div>
            <div>
              <h3>On Error</h3>
              <Input
                isDisabled
                value={flows[selectedFlow]?.states[selectedState]?.onError}
              />
            </div>
            <div style={{ margin: '1vh', textAlign: 'center' }}>
              {/* @ts-ignore */}
              <Button
                color="black"
                onClick={() => {
                  alert('Apply button clicked!');
                }}>
                Apply
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default MiddleSide;
