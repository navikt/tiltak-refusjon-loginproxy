import React, { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';
import { useHentRefusjoner } from '../../services/rest-service';
import BEMHelper from '../../utils/bem';
import { formatterDato, formatterPeriode } from '../../utils/datoUtils';
import { useFilter } from './FilterContext';
import LabelRad from './LabelRad';
import './oversikt.less';
import { LenkepanelBase } from 'nav-frontend-lenkepanel';
import StatusTekst from '../../komponenter/StatusTekst/StatusTekst';
import styled from 'styled-components';
import { ReactComponent as InfoIkon } from '@/asset/image/info.svg';
import { Undertittel } from 'nav-frontend-typografi';

const cls = BEMHelper('oversikt');

const Kolonne: FunctionComponent = (props) => <div className={cls.element('kolonne')}>{props.children}</div>;

const AvrundetHvitBoks = styled.div`
    border-radius: 4px;
    background-color: white;
    padding: 2rem 1rem;
    display: flex;
    align-items: center;
    > * {
        margin-right: 1rem;
    }
`;

const Info: FunctionComponent<{ tekst: string }> = (props) => (
    <AvrundetHvitBoks>
        <InfoIkon />
        <Undertittel tag="p">{props.tekst}</Undertittel>
    </AvrundetHvitBoks>
);

const Oversikt: FunctionComponent = () => {
    const { filter } = useFilter();
    const refusjoner = useHentRefusjoner(filter);
    const history = useHistory();

    if (refusjoner === undefined) {
        return <Info tekst="Oppgi søkekriterier for å finne refusjoner" />;
    }

    if (refusjoner.length === 0) {
        return <Info tekst="Finner ingen refusjoner" />;
    }

    return (
        <nav className={cls.className} aria-label="Main">
            <div role="list">
                <LabelRad className={cls.className} />
                {refusjoner.map((refusjon) => (
                    <LenkepanelBase
                        className={cls.element('rad')}
                        role="listitem"
                        key={refusjon.id}
                        onClick={(event) => {
                            event.preventDefault();
                            history.push({
                                pathname: `/refusjon/${refusjon.id}`,
                                search: window.location.search,
                            });
                        }}
                        href={`/refusjon/${refusjon.id}`}
                    >
                        <Kolonne aria-labelledby={cls.element('deltaker')}>
                            {refusjon.tilskuddsgrunnlag.deltakerFornavn} {refusjon.tilskuddsgrunnlag.deltakerEtternavn}
                        </Kolonne>
                        <Kolonne aria-labelledby={cls.element('periode')}>
                            {formatterPeriode(
                                refusjon.tilskuddsgrunnlag.tilskuddFom,
                                refusjon.tilskuddsgrunnlag.tilskuddTom
                            )}
                        </Kolonne>
                        <Kolonne aria-labelledby={cls.element('status')}>
                            <StatusTekst
                                status={refusjon.status}
                                tilskuddFom={refusjon.tilskuddsgrunnlag.tilskuddFom}
                                tilskuddTom={refusjon.tilskuddsgrunnlag.tilskuddTom}
                            />
                        </Kolonne>
                        <Kolonne aria-labelledby={cls.element('frist-godkjenning')}>
                            {formatterDato(refusjon.fristForGodkjenning)}
                        </Kolonne>
                    </LenkepanelBase>
                ))}
            </div>
        </nav>
    );
};

export default Oversikt;
