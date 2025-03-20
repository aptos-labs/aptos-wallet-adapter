var a=`
    fragment TokenActivitiesFields on token_activities_v2 {
  after_value
  before_value
  entry_function_id_str
  event_account_address
  event_index
  from_address
  is_fungible_v2
  property_version_v1
  to_address
  token_amount
  token_data_id
  token_standard
  transaction_timestamp
  transaction_version
  type
}
    `,i=`
    fragment AnsTokenFragment on current_aptos_names {
  domain
  expiration_timestamp
  registered_address
  subdomain
  token_standard
  is_primary
  owner_address
  subdomain_expiration_policy
  domain_expiration_timestamp
}
    `,s=`
    fragment CurrentTokenOwnershipFields on current_token_ownerships_v2 {
  token_standard
  token_properties_mutated_v1
  token_data_id
  table_type_v1
  storage_id
  property_version_v1
  owner_address
  last_transaction_version
  last_transaction_timestamp
  is_soulbound_v2
  is_fungible_v2
  amount
  current_token_data {
    collection_id
    description
    is_fungible_v2
    largest_property_version_v1
    last_transaction_timestamp
    last_transaction_version
    maximum
    supply
    token_data_id
    token_name
    token_properties
    token_standard
    token_uri
    decimals
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      max_supply
      mutable_description
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
  }
}
    `,_=`
    query getAccountCoinsCount($address: String) {
  current_fungible_asset_balances_aggregate(
    where: {owner_address: {_eq: $address}}
  ) {
    aggregate {
      count
    }
  }
}
    `,u=`
    query getAccountCoinsData($where_condition: current_fungible_asset_balances_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_fungible_asset_balances_order_by!]) {
  current_fungible_asset_balances(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    amount
    asset_type
    is_frozen
    is_primary
    last_transaction_timestamp
    last_transaction_version
    owner_address
    storage_id
    token_standard
    metadata {
      token_standard
      symbol
      supply_aggregator_table_key_v1
      supply_aggregator_table_handle_v1
      project_uri
      name
      last_transaction_version
      last_transaction_timestamp
      icon_uri
      decimals
      creator_address
      asset_type
    }
  }
}
    `,c=`
    query getAccountCollectionsWithOwnedTokens($where_condition: current_collection_ownership_v2_view_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_collection_ownership_v2_view_order_by!]) {
  current_collection_ownership_v2_view(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      mutable_description
      max_supply
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
    collection_id
    collection_name
    collection_uri
    creator_address
    distinct_tokens
    last_transaction_version
    owner_address
    single_token_uri
  }
}
    `,d=`
    query getAccountOwnedTokens($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${s}`,l=`
    query getAccountOwnedTokensByTokenData($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${s}`,y=`
    query getAccountOwnedTokensFromCollection($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${s}`,p=`
    query getAccountTokensCount($where_condition: current_token_ownerships_v2_bool_exp, $offset: Int, $limit: Int) {
  current_token_ownerships_v2_aggregate(
    where: $where_condition
    offset: $offset
    limit: $limit
  ) {
    aggregate {
      count
    }
  }
}
    `,m=`
    query getAccountTransactionsCount($address: String) {
  account_transactions_aggregate(where: {account_address: {_eq: $address}}) {
    aggregate {
      count
    }
  }
}
    `,g=`
    query getChainTopUserTransactions($limit: Int) {
  user_transactions(limit: $limit, order_by: {version: desc}) {
    version
  }
}
    `,T=`
    query getCollectionData($where_condition: current_collections_v2_bool_exp!) {
  current_collections_v2(where: $where_condition) {
    uri
    total_minted_v2
    token_standard
    table_handle_v1
    mutable_uri
    mutable_description
    max_supply
    collection_id
    collection_name
    creator_address
    current_supply
    description
    last_transaction_timestamp
    last_transaction_version
    cdn_asset_uris {
      cdn_image_uri
      asset_uri
      animation_optimizer_retry_count
      cdn_animation_uri
      cdn_json_uri
      image_optimizer_retry_count
      json_parser_retry_count
      raw_animation_uri
      raw_image_uri
    }
  }
}
    `,b=`
    query getCurrentFungibleAssetBalances($where_condition: current_fungible_asset_balances_bool_exp, $offset: Int, $limit: Int) {
  current_fungible_asset_balances(
    where: $where_condition
    offset: $offset
    limit: $limit
  ) {
    amount
    asset_type
    is_frozen
    is_primary
    last_transaction_timestamp
    last_transaction_version
    owner_address
    storage_id
    token_standard
  }
}
    `,$=`
    query getDelegatedStakingActivities($delegatorAddress: String, $poolAddress: String) {
  delegated_staking_activities(
    where: {delegator_address: {_eq: $delegatorAddress}, pool_address: {_eq: $poolAddress}}
  ) {
    amount
    delegator_address
    event_index
    event_type
    pool_address
    transaction_version
  }
}
    `,k=`
    query getEvents($where_condition: events_bool_exp, $offset: Int, $limit: Int, $order_by: [events_order_by!]) {
  events(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    account_address
    creation_number
    data
    event_index
    sequence_number
    transaction_block_height
    transaction_version
    type
    indexed_type
  }
}
    `,f=`
    query getFungibleAssetActivities($where_condition: fungible_asset_activities_bool_exp, $offset: Int, $limit: Int) {
  fungible_asset_activities(
    where: $where_condition
    offset: $offset
    limit: $limit
  ) {
    amount
    asset_type
    block_height
    entry_function_id_str
    event_index
    gas_fee_payer_address
    is_frozen
    is_gas_fee
    is_transaction_success
    owner_address
    storage_id
    storage_refund_amount
    token_standard
    transaction_timestamp
    transaction_version
    type
  }
}
    `,h=`
    query getFungibleAssetMetadata($where_condition: fungible_asset_metadata_bool_exp, $offset: Int, $limit: Int) {
  fungible_asset_metadata(where: $where_condition, offset: $offset, limit: $limit) {
    icon_uri
    project_uri
    supply_aggregator_table_handle_v1
    supply_aggregator_table_key_v1
    creator_address
    asset_type
    decimals
    last_transaction_timestamp
    last_transaction_version
    name
    symbol
    token_standard
    supply_v2
    maximum_v2
  }
}
    `,G=`
    query getNames($offset: Int, $limit: Int, $where_condition: current_aptos_names_bool_exp, $order_by: [current_aptos_names_order_by!]) {
  current_aptos_names(
    limit: $limit
    where: $where_condition
    order_by: $order_by
    offset: $offset
  ) {
    ...AnsTokenFragment
  }
}
    ${i}`,w=`
    query getNumberOfDelegators($where_condition: num_active_delegator_per_pool_bool_exp, $order_by: [num_active_delegator_per_pool_order_by!]) {
  num_active_delegator_per_pool(where: $where_condition, order_by: $order_by) {
    num_active_delegator
    pool_address
  }
}
    `,v=`
    query getObjectData($where_condition: current_objects_bool_exp, $offset: Int, $limit: Int, $order_by: [current_objects_order_by!]) {
  current_objects(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    allow_ungated_transfer
    state_key_hash
    owner_address
    object_address
    last_transaction_version
    last_guid_creation_num
    is_deleted
  }
}
    `,C=`
    query getProcessorStatus($where_condition: processor_status_bool_exp) {
  processor_status(where: $where_condition) {
    last_success_version
    processor
    last_updated
  }
}
    `,A=`
    query getTableItemsData($where_condition: table_items_bool_exp!, $offset: Int, $limit: Int, $order_by: [table_items_order_by!]) {
  table_items(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    decoded_key
    decoded_value
    key
    table_handle
    transaction_version
    write_set_change_index
  }
}
    `,q=`
    query getTableItemsMetadata($where_condition: table_metadatas_bool_exp!, $offset: Int, $limit: Int, $order_by: [table_metadatas_order_by!]) {
  table_metadatas(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    handle
    key_type
    value_type
  }
}
    `,Q=`
    query getTokenActivity($where_condition: token_activities_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [token_activities_v2_order_by!]) {
  token_activities_v2(
    where: $where_condition
    order_by: $order_by
    offset: $offset
    limit: $limit
  ) {
    ...TokenActivitiesFields
  }
}
    ${a}`,x=`
    query getCurrentTokenOwnership($where_condition: current_token_ownerships_v2_bool_exp!, $offset: Int, $limit: Int, $order_by: [current_token_ownerships_v2_order_by!]) {
  current_token_ownerships_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    ...CurrentTokenOwnershipFields
  }
}
    ${s}`,D=`
    query getTokenData($where_condition: current_token_datas_v2_bool_exp, $offset: Int, $limit: Int, $order_by: [current_token_datas_v2_order_by!]) {
  current_token_datas_v2(
    where: $where_condition
    offset: $offset
    limit: $limit
    order_by: $order_by
  ) {
    collection_id
    description
    is_fungible_v2
    largest_property_version_v1
    last_transaction_timestamp
    last_transaction_version
    maximum
    supply
    token_data_id
    token_name
    token_properties
    token_standard
    token_uri
    decimals
    current_collection {
      collection_id
      collection_name
      creator_address
      current_supply
      description
      last_transaction_timestamp
      last_transaction_version
      max_supply
      mutable_description
      mutable_uri
      table_handle_v1
      token_standard
      total_minted_v2
      uri
    }
  }
}
    `,O=(n,o,e,t)=>n();function I(n,o=O){return{getAccountCoinsCount(e,t){return o(r=>n.request(_,e,{...t,...r}),"getAccountCoinsCount","query",e)},getAccountCoinsData(e,t){return o(r=>n.request(u,e,{...t,...r}),"getAccountCoinsData","query",e)},getAccountCollectionsWithOwnedTokens(e,t){return o(r=>n.request(c,e,{...t,...r}),"getAccountCollectionsWithOwnedTokens","query",e)},getAccountOwnedTokens(e,t){return o(r=>n.request(d,e,{...t,...r}),"getAccountOwnedTokens","query",e)},getAccountOwnedTokensByTokenData(e,t){return o(r=>n.request(l,e,{...t,...r}),"getAccountOwnedTokensByTokenData","query",e)},getAccountOwnedTokensFromCollection(e,t){return o(r=>n.request(y,e,{...t,...r}),"getAccountOwnedTokensFromCollection","query",e)},getAccountTokensCount(e,t){return o(r=>n.request(p,e,{...t,...r}),"getAccountTokensCount","query",e)},getAccountTransactionsCount(e,t){return o(r=>n.request(m,e,{...t,...r}),"getAccountTransactionsCount","query",e)},getChainTopUserTransactions(e,t){return o(r=>n.request(g,e,{...t,...r}),"getChainTopUserTransactions","query",e)},getCollectionData(e,t){return o(r=>n.request(T,e,{...t,...r}),"getCollectionData","query",e)},getCurrentFungibleAssetBalances(e,t){return o(r=>n.request(b,e,{...t,...r}),"getCurrentFungibleAssetBalances","query",e)},getDelegatedStakingActivities(e,t){return o(r=>n.request($,e,{...t,...r}),"getDelegatedStakingActivities","query",e)},getEvents(e,t){return o(r=>n.request(k,e,{...t,...r}),"getEvents","query",e)},getFungibleAssetActivities(e,t){return o(r=>n.request(f,e,{...t,...r}),"getFungibleAssetActivities","query",e)},getFungibleAssetMetadata(e,t){return o(r=>n.request(h,e,{...t,...r}),"getFungibleAssetMetadata","query",e)},getNames(e,t){return o(r=>n.request(G,e,{...t,...r}),"getNames","query",e)},getNumberOfDelegators(e,t){return o(r=>n.request(w,e,{...t,...r}),"getNumberOfDelegators","query",e)},getObjectData(e,t){return o(r=>n.request(v,e,{...t,...r}),"getObjectData","query",e)},getProcessorStatus(e,t){return o(r=>n.request(C,e,{...t,...r}),"getProcessorStatus","query",e)},getTableItemsData(e,t){return o(r=>n.request(A,e,{...t,...r}),"getTableItemsData","query",e)},getTableItemsMetadata(e,t){return o(r=>n.request(q,e,{...t,...r}),"getTableItemsMetadata","query",e)},getTokenActivity(e,t){return o(r=>n.request(Q,e,{...t,...r}),"getTokenActivity","query",e)},getCurrentTokenOwnership(e,t){return o(r=>n.request(x,e,{...t,...r}),"getCurrentTokenOwnership","query",e)},getTokenData(e,t){return o(r=>n.request(D,e,{...t,...r}),"getTokenData","query",e)}}}export{a,i as b,s as c,_ as d,u as e,c as f,d as g,l as h,y as i,p as j,m as k,g as l,T as m,b as n,$ as o,k as p,f as q,h as r,G as s,w as t,v as u,C as v,A as w,q as x,Q as y,x as z,D as A,I as B};
//# sourceMappingURL=chunk-VHNX2NUR.mjs.map