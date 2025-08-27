package com.rgpay.pos.features.tabs.clients

import com.rgpay.pos.core.network.HttpClient
import kotlinx.coroutines.delay

data class TabApiResponse(
    val id: String,
    val tableId: String?,
    val numberOfPayers: Int?,
    val items: List<TabItemApi>,
    val isCancelled: Boolean = false,
    val total: Double,
    val remaining: Double
)

data class TabItemApi(
    val id: String,
    val name: String,
    val price: Double,
    val quantity: Int,
    val quantityPaid: Int
)

data class UnitApiResponse(
    val id: String,
    val name: String,
    val restaurantName: String,
    val address: String?
)

class TabsApiClient(
    private val httpClient: HttpClient
) {
    
    // GET /comandas
    suspend fun getTabs(): List<TabApiResponse> {
        // Simulação de chamada API
        delay(1000)
        
        return listOf(
            // Comanda parcialmente paga (aberta)
            TabApiResponse(
                id = "1",
                tableId = "Mesa 01",
                numberOfPayers = 2,
                items = listOf(
                    TabItemApi("1", "X-Burger", 15.90, 2, 1), // 1 de 2 pago
                    TabItemApi("2", "Refrigerante", 5.50, 2, 2) // 2 de 2 pago
                ),
                total = 42.80,
                remaining = 15.90
            ),
            // Comanda paga
            TabApiResponse(
                id = "2",
                tableId = "Mesa Pikachu",
                numberOfPayers = 4,
                items = listOf(
                    TabItemApi("3", "X-Burger", 15.90, 2, 2), // 2 de 2 pago
                    TabItemApi("4", "Refrigerante", 5.50, 2, 2) // 2 de 2 pago
                ),
                total = 42.80,
                remaining = 0.0
            ),
            // Mesa não registrada (aberta)
            TabApiResponse(
                id = "3",
                tableId = null,
                numberOfPayers = 1,
                items = listOf(
                    TabItemApi("5", "Batata Frita", 12.00, 1, 0) // 0 de 1 pago
                ),
                total = 12.00,
                remaining = 12.00
            )
        )
    }
    
    // GET /unidade/{unidadeId}
    suspend fun getUnit(unitId: String): UnitApiResponse {
        // Simulação de chamada API
        delay(500)
        
        return UnitApiResponse(
            id = unitId,
            name = "Unidade Centro",
            restaurantName = "Lorem ipsum Lanches",
            address = "Rua das Flores, 123 - Centro"
        )
    }
    
    // POST /comandas
    suspend fun createTab(tableId: String?, numberOfPayers: Int?): TabApiResponse {
        // Simulação de criação
        delay(800)
        
        return TabApiResponse(
            id = System.currentTimeMillis().toString(),
            tableId = tableId,
            numberOfPayers = numberOfPayers,
            items = emptyList(),
            total = 0.0,
            remaining = 0.0
        )
    }
    
    // PUT /comandas/{tabId}
    suspend fun updateTab(tabId: String, tab: TabApiResponse): TabApiResponse {
        // Simulação de atualização
        delay(600)
        
        return tab.copy(id = tabId)
    }
    
    // DELETE /comandas/{tabId}
    suspend fun cancelTab(tabId: String): Boolean {
        // Simulação de cancelamento
        delay(400)
        
        return true
    }
}
