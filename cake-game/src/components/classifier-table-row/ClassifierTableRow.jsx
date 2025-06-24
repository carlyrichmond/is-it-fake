import "./ClassifierTableRow.css";

function ClassifierTableRow(props) {

  function formatClassificationCollections(predictions, attributeName) {
    if (!predictions || predictions.length === 0) {
      return 'N/A';
    }

    return predictions[0][attributeName];
  }

  function formatClassificationString(classifier) {
    if (!classifier) {
      return 'N/A';
    }

    return classifier;
  }

  function getMatchIndicator() {
    if (props.result.expected_category === props.result.user_category) {
      return '✅';
    } 

    return '❌';
  }

  return (
    <>
      <tr className={`${ props.rowNumber % 2 === 0 ? 'alternative-row' : 'row'}`}>
        <th>
          <img className="image" alt="Random image" src={props.result.image_url} />
        </th>
        <th>{ getMatchIndicator() }</th>
        <th className="classification">{ props.result.expected_category }</th>
        <th className="classification">{ props.result.user_category }</th>
        <th className="classification">{ formatClassificationCollections(props.result.models?.mobilenet_classifier, 'className') }</th>
        <th className="classification">{ formatClassificationCollections(props.result.models?.coco_ssd_predictions, 'class') }</th>
        <th className="classification">{ formatClassificationString(props.result.models?.my_transfer_model_classifier?.category) }</th>
        <th className="classification">{ formatClassificationString(props.result.models?.my_model_classifier.category) }</th>
      </tr>
    </>
  );
}

export default ClassifierTableRow;
