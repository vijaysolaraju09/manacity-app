import React, { useEffect, useMemo, useState } from 'react';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';
import { Screen } from '../../components/Screen';
import { Card, ThemedText } from '../../components/Themed';
import FormTextInput from '../../components/FormTextInput';
import PrimaryButton from '../../components/PrimaryButton';
import AdminTable from '../../components/admin/AdminTable';
import AdminBadge from '../../components/admin/AdminBadge';
import { useServicesStore } from '../../store/useServicesStore';
import { useAdminStore } from '../../store/useAdminStore';
import { ServiceCategory } from '../../types/services';
import { useTheme } from '../../context/ThemeContext';

const AdminServicesScreen = () => {
  const theme = useTheme();
  const {
    categories,
    providers,
    createCategory,
    updateCategory,
    deleteCategory,
    assignProviderToCategory,
    removeProviderFromCategory,
  } = useServicesStore();
  const {
    serviceCategories,
    updateCategory: updateAdminCategory,
    createCategory: createAdminCategory,
    deleteCategory: deleteAdminCategory,
  } = useAdminStore();
  const [name, setName] = useState('');
  const [summary, setSummary] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [owner, setOwner] = useState('');
  const [compliance, setCompliance] = useState('');

  const mergedCategories: (ServiceCategory & { owner?: string; compliance?: string })[] = useMemo(
    () =>
      categories.map((category) => ({
        ...category,
        owner: serviceCategories.find((cat) => cat.id === category.id)?.owner,
        compliance: serviceCategories.find((cat) => cat.id === category.id)?.compliance,
      })),
    [categories, serviceCategories],
  );

  useEffect(() => {
    if (!selectedCategory && mergedCategories.length) {
      setSelectedCategory(mergedCategories[0].id);
    }
  }, [mergedCategories, selectedCategory]);

  const selected = mergedCategories.find((cat) => cat.id === selectedCategory) || mergedCategories[0];

  const handleCreate = () => {
    if (!name || !summary) return;
    createCategory({ name, summary });
    createAdminCategory({ name, summary, owner, compliance });
    setName('');
    setSummary('');
    setOwner('');
    setCompliance('');
  };

  return (
    <Screen>
      <ThemedText accessibilityRole="header" style={styles.title}>
        Services catalog
      </ThemedText>
      <ThemedText style={{ color: theme.colors.muted, marginBottom: theme.spacing.md }}>
        Build categories, curate providers, and keep compliance metadata up to date.
      </ThemedText>

      <Card>
        <ThemedText style={styles.sectionTitle}>Create or update a category</ThemedText>
        <FormTextInput label="Name" value={name} onChangeText={setName} placeholder="Handyman" />
        <FormTextInput label="Summary" value={summary} onChangeText={setSummary} placeholder="Quick fixes & repairs" />
        <FormTextInput label="Owner" value={owner} onChangeText={setOwner} placeholder="Ops lead" />
        <FormTextInput
          label="Compliance notes"
          value={compliance}
          onChangeText={setCompliance}
          placeholder="e.g. Background checks required"
        />
        <PrimaryButton title="Save category" onPress={handleCreate} />
      </Card>

      <Card>
        <ThemedText style={styles.sectionTitle}>Categories</ThemedText>
        <FlatList
          horizontal
          data={mergedCategories}
          keyExtractor={(item) => item.id}
          showsHorizontalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ width: 10 }} />}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedCategory(item.id)}
              style={({ pressed }) => [
                styles.categoryPill,
                {
                  backgroundColor: selectedCategory === item.id ? `${theme.colors.primary}12` : theme.colors.card,
                  borderColor: selectedCategory === item.id ? theme.colors.primary : theme.colors.border,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{item.name}</ThemedText>
              <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>
                {providers.filter((provider) => provider.services.includes(item.id)).length} providers
              </ThemedText>
              {item.compliance ? <AdminBadge label={item.compliance} tone="warning" /> : null}
              {item.owner ? <AdminBadge label={`Owner: ${item.owner}`} tone="info" /> : null}
              <View style={styles.categoryActions}>
                <PrimaryButton title="Edit" onPress={() => updateCategory(item.id, { summary: summary || item.summary })} />
                <PrimaryButton
                  title="Delete"
                  onPress={() => {
                    deleteCategory(item.id);
                    deleteAdminCategory(item.id);
                  }}
                />
              </View>
            </Pressable>
          )}
        />
      </Card>

      {selected ? (
        <Card>
          <ThemedText style={styles.sectionTitle}>Assign providers to {selected.name}</ThemedText>
          <AdminTable
            columns={[
              {
                key: 'provider',
                title: 'Provider',
                width: '35%',
                render: (row) => (
                  <View>
                    <ThemedText style={{ fontFamily: 'Inter_600SemiBold' }}>{row.name}</ThemedText>
                    <ThemedText style={{ color: theme.colors.muted, fontSize: 12 }}>{row.location}</ThemedText>
                  </View>
                ),
              },
              {
                key: 'services',
                title: 'Services',
                width: '35%',
                render: (row) => (
                  <ThemedText style={{ color: theme.colors.muted }}>
                    {row.services.map((service) => mergedCategories.find((cat) => cat.id === service)?.name || service).join(', ')}
                  </ThemedText>
                ),
              },
              {
                key: 'actions',
                title: 'Actions',
                width: '30%',
                render: (row) => {
                  const isAssigned = row.services.includes(selected.id);
                  return (
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <PrimaryButton
                        title={isAssigned ? 'Remove' : 'Assign'}
                        onPress={() =>
                          isAssigned
                            ? removeProviderFromCategory({ providerId: row.id, categoryId: selected.id })
                            : assignProviderToCategory({ providerId: row.id, categoryId: selected.id })
                        }
                      />
                      <PrimaryButton
                        title="Flag"
                        onPress={() => updateAdminCategory(selected.id, { compliance: 'Manual review' })}
                      />
                    </View>
                  );
                },
              },
            ]}
            data={providers}
            rowKey={(row) => row.id}
          />
        </Card>
      ) : null}
    </Screen>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  categoryPill: {
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    width: 220,
    gap: 6,
  },
  categoryActions: {
    flexDirection: 'row',
    gap: 8,
  },
});

export default AdminServicesScreen;
