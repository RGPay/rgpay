package com.rgpay.pos.features.tabs.mappers

import com.rgpay.pos.features.tabs.clients.TabApiResponse
import com.rgpay.pos.features.tabs.clients.TabItemApi
import com.rgpay.pos.features.tabs.data.models.RestaurantTabModel
import com.rgpay.pos.features.tabs.data.models.TabItem
import java.math.BigDecimal

object TabMapper {
    
    fun mapApiToDomain(apiResponse: TabApiResponse): RestaurantTabModel {
        return RestaurantTabModel(
            tableNumber = apiResponse.tableNumber,
            numberOfPayers = apiResponse.numberOfPayers,
            items = apiResponse.items.map { mapItemApiToDomain(it) },
            isCancelled = apiResponse.isCancelled
        )
    }
    
    fun mapDomainToApi(domainModel: RestaurantTabModel): TabApiResponse {
        return TabApiResponse(
            id = "", // Será definido pelo backend
            tableNumber = domainModel.tableNumber,
            numberOfPayers = domainModel.numberOfPayers,
            items = domainModel.items.map { mapItemDomainToApi(it) },
            isCancelled = domainModel.isCancelled,
            total = domainModel.total.toDouble(),
            remaining = domainModel.remaining.toDouble()
        )
    }
    
    private fun mapItemApiToDomain(apiItem: TabItemApi): TabItem {
        return TabItem(
            id = apiItem.id,
            name = apiItem.name,
            price = BigDecimal.valueOf(apiItem.price),
            quantity = apiItem.quantity,
            quantityPaid = apiItem.quantityPaid
        )
    }
    
    private fun mapItemDomainToApi(domainItem: TabItem): TabItemApi {
        return TabItemApi(
            id = domainItem.id,
            name = domainItem.name,
            price = domainItem.price.toDouble(),
            quantity = domainItem.quantity,
            quantityPaid = domainItem.quantityPaid
        )
    }
    
    fun mapApiListToDomain(apiList: List<TabApiResponse>): List<RestaurantTabModel> {
        return apiList.map { mapApiToDomain(it) }
    }
    
    fun mapDomainListToApi(domainList: List<RestaurantTabModel>): List<TabApiResponse> {
        return domainList.map { mapDomainToApi(it) }
    }
}
