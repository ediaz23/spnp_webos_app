
import { Header, Panel } from '@enact/moonstone/Panels'
import $L from '@enact/i18n/$L'
import PropTypes from 'prop-types'
import { Row, Cell, Layout } from '@enact/ui/Layout'
import Image from '@enact/moonstone/Image'
import Item from '@enact/moonstone/Item'
import ri from '@enact/ui/resolution'
import ExpandableItem from '@enact/moonstone/ExpandableItem'
import githubImg from '../../assets/img/github.png'
import paypalImg from '../../assets/img/paypal.png'
import btcImg from '../../assets/img/btc.png'
import ethImg from '../../assets/img/eth.png'
import perfilImg from '../../assets/img/perfil.jpeg'
import perfilImg2 from '../../assets/img/perfil2.jpg'


const ImageInfo = (props) => (
    <Layout orientation="vertical" align="center"
        style={{ height: '100%', width: '100%' }}>
        {props.title &&
            <Cell
                component={Item}
                {...props.title}
                align='center'
                shrink
            />
        }
        <Cell
            component={Image}
            {...props.image}
            align='center'
            style={{
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
            }}
        />
    </Layout>
)

const ContactMePanel = ({ title, titleBelow, ...rest }) => {
    return (
        <Panel {...rest}>
            <Header title={title} titleBelow={titleBelow} />
            <Row style={{ height: '50%' }} align="center">
                <Cell>
                    <ExpandableItem
                        style={{
                            textAlign: 'justify',
                            margin: '0 ' + ri.unit(12, 'rem'),
                        }}
                        title={$L('About me')}>
                        {$L(`Hi there! My name is Esteban and I'm a programmer by
 profession. I have been in the tech industry for couple of years now and I love
 what I do. In my free time, I enjoy watching anime and staying up to date with
 the latest shows.`)}
                    </ExpandableItem>
                </Cell>
                <Cell style={{ height: '100%' }}>
                    <ImageInfo
                        image={{ src: perfilImg2 }}
                        title={{ children: $L('Avatar') }} />
                </Cell>
                <Cell >
                    <ExpandableItem
                        style={{
                            textAlign: 'justify',
                            margin: '0 ' + ri.unit(12, 'rem'),
                        }}
                        title={$L('Issues or suggestion?')}>
                        {$L(`If you have any issues, problems, or suggestion
 regarding our project, please feel free to leave them in our GitHub repository.
 Your feedback is always welcome and will help us improve our project.`)
                        }
                    </ExpandableItem>
                </Cell>
                <Cell style={{ height: '100%' }}>
                    <ImageInfo
                        image={{ src: githubImg }}
                        title={{ children: 'Github' }}
                    />
                </Cell>
            </Row>
            <Row style={{ height: '50%' }} align="center">
                <Cell >
                    <ExpandableItem
                        style={{
                            textAlign: 'justify',
                            margin: '0 ' + ri.unit(12, 'rem'),
                        }}
                        title={$L('Donation?')}>
                        {$L(`We appreciate your support for our project! If you
 would like to make a donation, we offer several options to choose from. Your
 contributions help us continue to develop. Thank you for your generosity!`)}
                    </ExpandableItem>
                </Cell>
                <Cell style={{ height: '100%' }}>
                    <ImageInfo
                        image={{ src: paypalImg }}
                        title={{ children: 'Paypal' }}
                    />
                </Cell>
                <Cell style={{ height: '100%' }}>
                    <ImageInfo
                        image={{ src: ethImg }}
                        title={{ children: 'Ethereum' }}
                    />
                </Cell>
                <Cell style={{ height: '100%' }}>
                    <ImageInfo
                        image={{ src: btcImg }}
                        title={{ children: 'Bitcoin (Native Segwit)' }}
                    />
                </Cell>
            </Row>
        </Panel>
    )
}

ContactMePanel.propTypes = {
    spotlightId: PropTypes.string,
    title: PropTypes.string,
    titleBelow: PropTypes.string,
}

export default ContactMePanel
