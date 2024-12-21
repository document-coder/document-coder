import React from "react";
import PartBar from "src/components/widgets/PartBar";
import Logger from "src/Logger";
const log = Logger("policy-admin", "blue");

export default function PolicyInfoBox({ policy }) {
  return (
    <div id="policy-info-container">
      <div className="info-item" id="id-info">
        <div className="info-name">ID</div>
        <div className="info-value">{JSON.stringify(policy.id)}</div>
      </div>
      <div className="info-item" id="company_name-info">
        <div className="info-name">site registered to:</div>
        <div className="info-value">{JSON.stringify(policy.company_name)}</div>
      </div>
      <div className="info-item" id="site_name-info">
        <div className="info-name">domain</div>
        <div className="info-value">{JSON.stringify(policy.name)}</div>
      </div>
      <div className="info-item" id="locale-info">
        <div className="info-name">locale</div>
        <div className="info-value">{JSON.stringify(policy.locale)}</div>
      </div>
      <div className="info-item" id="alexa_rank-info">
        <div className="info-name">global rank</div>
        <div className="info-value">{JSON.stringify(policy.alexa_rank)}</div>
      </div>
      <div className="info-item" id="alexa_rank_US-info">
        <div className="info-name">US rank</div>
        <div className="info-value">{JSON.stringify(policy.alexa_rank_US)}</div>
      </div>
      <div className="info-item" id="start_date-info">
        <div className="info-name">registered</div>
        <div className="info-value">{JSON.stringify(policy.start_date)}</div>
      </div>
      <div className="info-item" id="contentdata-sitedata-info">
        <div className="info-name">Site Description</div>
        <div className="info-value">{policy.meta.contentdata?.sitedata?.description}</div>
      </div>
      {policy.categories.length > 0 ? (
        <div className="info-item" id="categories-info">
          <div className="info-name">Tags</div>
          <div className="info-value">
            {policy.categories.map((category, i) => (
              <div className="category" key={i}>
                {category}
              </div>
            ))}
          </div>
        </div>
      ) : (
        ""
      )}
      {policy.meta.contentdata ? (
        <div>
          <div className="info-item" id="trafficdata-contributingsubdomains-info">
            <div className="info-name">contribution to traffic by subdomain</div>
            <div className="info-value">
              <PartBar
                category_pairs={policy.meta.trafficdata.contributingsubdomains.map(
                  ({ pageviews: { percentage }, dataurl }) => [dataurl, percentage]
                )}
              />
            </div>
          </div>
          <div className="info-item" id="trafficdata-rankbycountry-traffic-info">
            <div className="info-name">Traffic by country</div>
            <div className="info-value">
              <PartBar
                category_pairs={_.toPairs(policy.meta.trafficdata.rankbycountry).map(([k, v], i) => [
                  k == "O" ? "unknown" : k,
                  v.contribution.pageviews,
                ])}
              />
            </div>
          </div>
          <div className="info-item" id="trafficdata-rankbycountry-users-info">
            <div className="info-name">Users by country</div>
            <div className="info-value">
              <PartBar
                category_pairs={_.toPairs(policy.meta.trafficdata.rankbycountry).map(([k, v], i) => [
                  k == "O" ? "unknown" : k,
                  v.contribution.users,
                ])}
              />
            </div>
          </div>
        </div>
      ) : ("")
      }
    </div>
  )
}
