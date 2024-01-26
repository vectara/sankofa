import {VuiAppHeader, VuiFlexContainer, VuiLink, VuiText, VuiTextColor} from "~ui";
// @ts-ignore
import logo from '../../assets/vectara_logo.png';

function Header() {
  return (
    <>
      <VuiAppHeader
        data-testid="loggedInHeader"
        left={
          <VuiFlexContainer alignItems="center" >
              <a href="https://vectara.com/">
                  {/* If we position the logo with a CSS class, for some reason it flashes for a moment
                at its original size. Repro in Chrome on MacOS. */}

                  <img style={{ height: "1.5em", marginTop: "-3px" }} src={logo} alt="Vectara logo" />
              </a>
              <div style={{marginLeft: "15px"}}>
                  <VuiTextColor color="subdued">
                      <a href="https://en.wikipedia.org/wiki/Sankofa"><VuiText size="m">Sankofa</VuiText></a>
                  </VuiTextColor>
              </div>
          </VuiFlexContainer>
        }
      />
    </>
  );
}

export default Header;
