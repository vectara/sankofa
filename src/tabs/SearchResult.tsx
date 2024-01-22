import {
    VuiText,
    VuiTextColor,
    VuiFlexContainer,
    VuiFlexItem,
    VuiSearchResult,
} from "~ui";
import { truncateEnd, truncateStart } from "../ui/utils/truncateString";

import type {DeserializedSearchResult} from "~types";
import "./SearchResult.scss";
import '../style.scss'

type Props = {
    result: DeserializedSearchResult;
    position: number;
};

const CONTEXT_MAX_LENGTH = 200;

export const SearchResult = ({ result, position }: Props) => {
        const {
            source,
            title,
            url,
            snippet: { pre, post, text },
        } = result;

        return (
            <VuiSearchResult
                result={{
                    title,
                    url,
                    snippet: {
                        pre: truncateStart(pre, CONTEXT_MAX_LENGTH),
                        text,
                        post: truncateEnd(post, CONTEXT_MAX_LENGTH),
                    },
                }}
                position={position + 1}
                subTitle={
                        <VuiFlexContainer
                            alignItems="center"
                            spacing="xs"
                            className="searchResultFilterGroup"
                        >
                            {url && (
                                <VuiFlexItem grow={1}>
                                    <VuiText size="s" className="searchResultSiteCategory">
                                        <p>
                                            <VuiTextColor color="subdued">{url}</VuiTextColor>
                                        </p>
                                    </VuiText>
                                </VuiFlexItem>
                            )}
                        </VuiFlexContainer>
                }
            />
        );
    }