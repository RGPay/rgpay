package com.rgpay.pos.core.di

import com.rgpay.pos.core.network.HttpClient
import com.rgpay.pos.features.registrations.clients.DeviceApiClient
import com.rgpay.pos.features.registrations.domain.DeviceRegistrationUseCase
import com.rgpay.pos.features.tabs.data.repository.TabRepository
import com.rgpay.pos.features.tabs.domain.TabUseCase
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    
    @Provides
    @Singleton
    fun provideHttpClient(): HttpClient {
        return HttpClient()
    }
    
    @Provides
    @Singleton
    fun provideDeviceApiClient(): DeviceApiClient {
        return DeviceApiClient()
    }
    
    @Provides
    @Singleton
    fun provideDeviceRegistrationUseCase(deviceApiClient: DeviceApiClient): DeviceRegistrationUseCase {
        return DeviceRegistrationUseCase(deviceApiClient)
    }
    
    @Provides
    @Singleton
    fun provideTabRepository(): TabRepository {
        return TabRepository()
    }
    
    @Provides
    @Singleton
    fun provideTabUseCase(): TabUseCase {
        return TabUseCase()
    }
}
