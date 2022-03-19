import React from 'react' // eslint-disable-line

const TerminalWelcomeMessage = ({ packageJson }) => {
  return (
    <div className="remix_ui_terminal_block px-4 " data-id="block_null">
      <div> - Welcome to Nearby {packageJson} - </div><br />
      <div>You can use this terminal to: </div>
      <ul className='ml-0 mr-4'>
        <li>Check account balances.</li>
        <li>Execute near command scripts:
          <br />
          <i> - Input a command directly in the command line interface </i>
        </li>
      </ul>
      <div>The following libraries are accessible:</div>
      <ul className='ml-0 mr-4'>
        <li><a target="_blank" href="https://docs.near.org/docs/api/naj-quick-reference"></a></li>
        <li>near (run near.help() for more info)</li>
      </ul>
    </div>
  )
}

export default TerminalWelcomeMessage
