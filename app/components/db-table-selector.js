import sharedStyles from '../componentStyles/shared-layout.module.css';

export default function TableSelector({ setTableSelection }) {
  function handleChange(event) {
    setTableSelection(event.target.value);
  }

  return (
    <div className={sharedStyles.toolbarItem}>
        {/**form is just for styling */}
      <form className={sharedStyles.toolbarForm}>
        
        <label htmlFor="tableSelector" className={sharedStyles.toolbarLabel}>Choose a table:</label>

        <select id="tableSelector" className={sharedStyles.toolbarSelect} onChange={handleChange}>
          <option value="hr">UKG</option>
          <option value="ws">Well Sky</option>
        </select>

      </form>
    </div>
  );
}
