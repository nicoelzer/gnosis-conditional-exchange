import React, { useState } from 'react'
import { withRouter } from 'react-router'
import { NavLink, RouteComponentProps } from 'react-router-dom'
import styled from 'styled-components'
import { useWeb3Context } from 'web3-react/dist'

import { ConnectedWeb3 } from '../../../hooks'
import { ButtonType } from '../../../theme/component_styles/button_styling_types'
import { Button, ButtonConnectWallet, ButtonDisconnectWallet, Logo, Network } from '../../common'
import { ModalConnectWallet } from '../../modal'

const HeaderWrapper = styled.div`
  align-items: flex-end;
  background: ${props => props.theme.header.backgroundColor};
  display: flex;
  flex-grow: 0;
  flex-shrink: 0;
  height: ${props => props.theme.header.height};
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 5;
`

const HeaderInner = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin: 0 auto;
  max-width: 100%;
  padding: 0 10px;
  position: relative;
  width: ${props => props.theme.themeBreakPoints.xxl};

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    padding: 0 ${props => props.theme.paddings.mainPadding};
  }
`

const ButtonCreate = styled(Button)`
  font-size: 12px;
  padding-left: 10px;
  padding-right: 10px;

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    font-size: 14px;
    padding-left: 20px;
    padding-right: 20px;
  }
`

const NetworkStyled = styled(Network)`
  margin: 0 0 0 5px;

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    margin-left: 12px;
  }
`

const ButtonConnectWalletStyled = styled(ButtonConnectWallet)`
  margin: 0 0 0 5px;

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    margin-left: 12px;
  }
`

const ButtonDisconnectWalletStyled = styled(ButtonDisconnectWallet)`
  display: none;

  @media (min-width: ${props => props.theme.themeBreakPoints.md}) {
    display: flex;
    margin-left: 12px;
  }
`

const ContentsRight = styled.div`
  align-items: center;
  display: flex;
  margin: 0 0 0 auto;
`

const LogoWrapper = styled(NavLink)``

const HeaderContainer: React.FC<RouteComponentProps> = (props: RouteComponentProps) => {
  const context = useWeb3Context()

  const { history, ...restProps } = props
  const [isModalOpen, setModalState] = useState(false)

  return (
    <HeaderWrapper {...restProps}>
      <HeaderInner>
        <LogoWrapper to="/">
          <Logo />
        </LogoWrapper>
        <ContentsRight>
          <ButtonCreate buttonType={ButtonType.secondaryLine} onClick={() => history.push('/create')}>
            Create Market
          </ButtonCreate>
          {!context.account && (
            <ButtonConnectWalletStyled
              modalState={isModalOpen}
              onClick={() => {
                setModalState(true)
              }}
            />
          )}
          <ConnectedWeb3>
            <NetworkStyled />
            <ButtonDisconnectWalletStyled
              callback={() => {
                setModalState(false)
              }}
            />
          </ConnectedWeb3>
        </ContentsRight>
        <ModalConnectWallet isOpen={isModalOpen} onClose={() => setModalState(false)} />
      </HeaderInner>
    </HeaderWrapper>
  )
}

export const Header = withRouter(HeaderContainer)
